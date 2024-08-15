import {
  AsyncLoadingCache,
  Caches,
} from "@inventivetalent/loading-cache/dist/esm/src";
import { Time } from "@inventivetalent/time";
import { FeaturesApi } from "../features";
import { z } from "zod";

const fontRenderer = {
  getCachedImage(text: string) {
    return document.createTextNode(text);
  },
};

const PronounsResponse = z.record(
  z.string(),
  z
    .object({
      name: z.string(),
      subject: z.string(),
      object: z.string().nullish(),
      singular: z.boolean(),
    })
    .passthrough(),
);
const UserResponse = z
  .object({
    channel_id: z.string(),
    channel_login: z.string(),
    pronoun_id: z.string(),
    alt_pronoun_id: z.string().nullish(),
  })
  .passthrough();

export const pronounsReplacer = {
  pronounsApi: "https://api.pronouns.alejo.io/v1/",
  map: null as null | z.output<typeof PronounsResponse>,
  cache: null as null | AsyncLoadingCache<string, unknown | null>,
  async replacePronouns(node: Element, userId?: string, username?: string) {
    if (userId == null || username == null) {
      return;
    }
    if (
      !(await this.loadPronounsMap()) ||
      this.cache == null ||
      this.map == null
    ) {
      // error loading pronouns map
      return;
    }
    const map = this.map;
    const key = "users/" + username;
    const result = await this.cache.get(key);
    if (result == null) {
      // error loading pronouns
      return;
    }
    const response = UserResponse.safeParse(result);
    if (!response.success) {
      // unknown data format
      console.error(`error parsing data: ${response.error}`);
      return;
    }
    if (response.data.channel_id != userId) {
      // wrong user id
      return;
    }
    const pronouns = [
      response.data.pronoun_id,
      response.data.alt_pronoun_id,
    ].flatMap((item) =>
      item === null || item === undefined || item === "" || !(item in map)
        ? []
        : [map[item]],
    );
    if (pronouns.length <= 0) {
      // no known pronouns
      return;
    }
    if (pronouns.length == 1) {
      const [pronoun] = pronouns;
      if (
        pronoun.singular ||
        pronoun.object === null ||
        pronoun.object === undefined ||
        pronoun.object === ""
      ) {
        node.replaceChildren(fontRenderer.getCachedImage(pronoun.subject));
      } else {
        node.replaceChildren(
          fontRenderer.getCachedImage(`${pronoun.subject}/${pronoun.object}`),
        );
      }
    } else {
      node.replaceChildren(
        fontRenderer.getCachedImage(
          pronouns.map((pronoun) => pronoun.subject).join("/"),
        ),
      );
    }
  },
  async loadPronounsMap() {
    if (this.map == null) {
      const result = await this.createPronounsMap();
      if (result == null) {
        return false;
      }
      this.map = result;
    }
    return true;
  },
  async createPronounsMap() {
    if (this.cache == null) {
      return null;
    }
    const result = await this.cache.get("pronouns");
    if (result == null) {
      return null;
    }
    const response = PronounsResponse.safeParse(result);
    if (!response.success) {
      console.error(`error parsing data: ${response.error}`);
      return null;
    }
    console.log("pronouns definitions loaded");
    return response.data;
  },
  async fetchPronouns(key: string): Promise<Record<string, string>[] | null> {
    console.log(`loading pronouns: ${key}`);
    try {
      const result = await fetch(this.pronounsApi + key).then((resp) =>
        resp.ok ? resp.json() : null,
      );
      console.log(
        `loaded pronouns: ${key} (${result === null ? "empty" : "response"})`,
      );
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async load(api: FeaturesApi) {
    if (api.settings.showPronouns) {
      api.forClass("pronouns", Element, (nodes, context) => {
        if (context.service.includes("twitch")) {
          // only do this for twitch
          this.replacePronouns(nodes, context.user.id, context.user.name);
        }
      });
      this.map = null;
      this.cache = Caches.builder()
        .expireAfterWrite(Time.minutes(5))
        .buildAsync((key: string) => this.fetchPronouns(key));
      void this.loadPronounsMap();
    }
  },
};
