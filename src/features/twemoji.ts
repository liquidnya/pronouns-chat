import type { FeaturesApi } from "../features";
import twemojiApi from "@twemoji/api";
import type { Twemoji } from "@twemoji/api";

export const twemoji = {
  replaceMessage(message: HTMLElement) {
    (twemojiApi as Twemoji).parse(message);
  },
  async load(api: FeaturesApi) {
    api.forClass("message", HTMLElement, this.replaceMessage.bind(this));
  },
};
