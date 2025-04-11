import { AsyncLoadingCache, Caches } from "@inventivetalent/loading-cache";
import { Time } from "@inventivetalent/time";
import { FeaturesApi } from "../../features";
import { z } from "zod";

const LookupResponse = z.record(
  z
    .object({
      sets: z.record(z.array(z.string())),
    })
    .passthrough(),
);

// mapping from subject form to object form
const subjectToObject: Record<string, string> = {
  // these are the only ones supported by pronoundb.org as of 2025-04-11
  he: "him",
  it: "its",
  she: "her",
  they: "them",
  // optimistically adding these forms
  ae: "aer",
  e: "em",
  fae: "faer",
  per: "per",
  ve: "ver",
  xe: "xem",
  zie: "hier",
};

const capitalize = (value: string): string =>
  value === "" ? "" : value.charAt(0).toUpperCase() + value.slice(1);

type FetchFn<T, V> = (items: T[]) => Promise<V>;

type Batch<T, V> = {
  get(key: T): Promise<V>;
};

type Item<T, V> = {
  key: T;
  resolve: (value: V) => void;
  reject: (reason?: unknown) => void;
};

type Queue<T, V> = {
  items: Item<T, V>[];
  done: boolean;
};

// FIXME: replace with Promise.withResolvers()
function withResolvers<T>() {
  let resolve, reject;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {
    promise,
    resolve: resolve as unknown as (value: T | PromiseLike<T>) => void,
    reject: reject as unknown as (reason?: unknown) => void,
  };
}

function createBatch<T, V>(
  fetchFn: FetchFn<T, V>,
  batchLimit: number,
  waitTime: number = 500,
): Batch<T, V> {
  let queue: Queue<T, V> = {
    items: [],
    // start with a queue that is already done
    done: true,
  };
  const runFetch = (queue: Queue<T, V>) => {
    if (!queue.done) {
      queue.done = true;
      fetchFn(queue.items.map((item) => item.key))
        .then((value) => queue.items.forEach((item) => item.resolve(value)))
        .catch((reason) => queue.items.forEach((item) => item.reject(reason)));
    }
  };
  return {
    get(key: T) {
      const { promise, resolve, reject } = withResolvers<V>();
      const item: Item<T, V> = {
        key,
        resolve,
        reject,
      };
      if (queue.done) {
        // start a new queue
        queue = {
          items: [item],
          done: false,
        };
        const queueInTimer = queue;
        setTimeout(() => runFetch(queueInTimer), waitTime);
      } else {
        // add to queue
        queue.items.push(item);
        if (queue.items.length >= batchLimit) {
          // run early
          runFetch(queue);
        }
      }
      return promise;
    },
  };
}

export const pronounsService = {
  pronounsApi: "https://pronoundb.org/api/v2/lookup",
  cache: null as null | AsyncLoadingCache<string, unknown | null>,
  async getPronouns(userId?: string): Promise<string | null> {
    if (userId == null) {
      return null;
    }
    if (this.cache == null) {
      // cache not available
      return null;
    }
    const result = await this.cache.get(userId);
    if (result == null) {
      // error loading pronouns
      return null;
    }
    const response = LookupResponse.safeParse(result);
    if (!response.success) {
      // unknown data format
      console.error(`error parsing data: ${response.error}`);
      return null;
    }
    if (!(userId in response.data)) {
      // wrong user id or user not found
      return null;
    }

    const sets = response.data[userId].sets;
    if (!("en" in sets)) {
      // user does not have the locale "en" set
      return null;
    }
    const pronouns = response.data[userId].sets["en"];

    if (pronouns.length <= 0) {
      // no known pronouns
      return null;
    }
    if (pronouns.length == 1) {
      const [pronoun] = pronouns;
      if (!(pronoun in subjectToObject)) {
        return capitalize(pronoun);
      } else {
        return `${capitalize(pronoun)}/${capitalize(subjectToObject[pronoun])}`;
      }
    } else {
      return pronouns.map((pronoun) => capitalize(pronoun)).join("/");
    }
  },
  async fetchPronounsBatch(ids: string[]): Promise<unknown | null> {
    console.log(`loading pronouns: ${ids.join(",")}`);
    try {
      const url = new URL(this.pronounsApi);
      url.searchParams.append("platform", "twitch");
      url.searchParams.append("ids", ids.join(","));
      const result = await fetch(url, {
        headers: {
          "X-PronounDB-Source": userAgent,
        },
      }).then((resp) => (resp.ok ? (resp.json() as unknown) : null));
      console.log(
        `loaded pronouns: ${ids.join(",")} (${result === null ? "empty" : "response"})`,
      );
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async load(api: FeaturesApi) {
    if (api.settings.showPronouns) {
      const batch = createBatch(
        (ids: string[]) => this.fetchPronounsBatch(ids),
        50,
      );
      this.cache = Caches.builder()
        .expireAfterWrite(Time.minutes(5))
        .buildAsync((id: string) => batch.get(id));
    }
  },
};
