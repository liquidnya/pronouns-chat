import { FeaturesApi } from "../features";
import twemojiApi, { Twemoji } from "@discordapp/twemoji";

export const twemoji = {
  replaceMessage(message: HTMLElement) {
    (twemojiApi as Twemoji).parse(message);
  },
  async load(api: FeaturesApi) {
    api.forClass("message", HTMLElement, this.replaceMessage.bind(this));
  },
};
