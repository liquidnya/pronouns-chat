import { ExtensionsApi } from "../extensions";
import twemojiApi, { Twemoji } from "@twemoji/api";

export const twemoji = {
  replaceMessages(messages: HTMLElement[]) {
    messages.forEach((message) => this.replaceMessage(message));
  },
  replaceMessage(message: HTMLElement) {
    (twemojiApi as Twemoji).parse(message);
  },
  async load(api: ExtensionsApi) {
    api.forClass("message", HTMLElement, this.replaceMessages.bind(this));
  },
};
