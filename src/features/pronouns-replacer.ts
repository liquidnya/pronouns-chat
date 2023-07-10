import { AsyncLoadingCache, Caches } from "@inventivetalent/loading-cache";
import { Time } from "@inventivetalent/time";
import { FeaturesApi } from "../features";

const fontRenderer = {
  getCachedImage(text: string) {
    return document.createTextNode(text);
  },
};

export const pronounsReplacer = {
  pronounsApi: "https://pronouns.alejo.io/api/",
  map: null as null | Record<string, string>,
  cache: null as null | AsyncLoadingCache<
    string,
    Record<string, string>[] | null
  >,
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
    result
      .filter((item) => item.id == userId)
      .map((item) => map[item.pronoun_id])
      .filter((pronouns) => pronouns != null && pronouns != "")
      .forEach((pronouns) =>
        node.replaceChildren(fontRenderer.getCachedImage(pronouns))
      );
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
    const pronouns = Object.fromEntries(
      result.map((item) => [item.name, item.display])
    );
    console.log("pronouns loaded");
    return pronouns;
  },
  async fetchPronouns(key: string): Promise<Record<string, string>[] | null> {
    console.log("loading pronouns: " + key);
    try {
      const result = await fetch(this.pronounsApi + key).then((resp) =>
        resp.json()
      );
      if (!Array.isArray(result)) {
        return null;
      }
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  async load(api: FeaturesApi) {
    if (api.settings.showPronouns) {
      api.forClass("pronouns", Element, (nodes, context) =>
        this.replacePronouns(nodes, context.user.id, context.user.name)
      );
      this.map = null;
      this.cache = Caches.builder()
        .expireAfterWrite(Time.minutes(5))
        .buildAsync((key: string) => this.fetchPronouns(key));
      void this.loadPronounsMap();
    }
  },
};
