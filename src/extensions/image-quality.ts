import { ExtensionsApi } from "../extensions";

export const imageQuality = {
  fixBadges(badges: HTMLImageElement[]) {
    badges.forEach((badge) => this.fixBadge(badge));
  },
  fixBadge(badge: HTMLImageElement) {
    badge.src = this.fixBadgeUrl(badge.src);
  },
  fixBadgeUrl(url: string) {
    return url.replace(
      /(^|")(https:\/\/static-cdn.jtvnw.net\/badges\/v1\/[^/]+)\/1("|$)/g,
      "$1$2/3$3"
    );
  },
  fixEmotes(emotes: HTMLElement[]) {
    emotes.forEach((emote) => this.fixEmote(emote));
  },
  fixEmote(emote: HTMLElement) {
    emote.style.backgroundImage = this.fixEmoteUrl(emote.style.backgroundImage);
    [...emote.getElementsByTagName("img")].forEach((img) =>
      this.fixEmoteImg(img)
    );
  },
  fixEmoteImg(img: HTMLImageElement) {
    img.src = this.fixEmoteUrl(img.src);
  },
  fixEmoteUrl(url: string) {
    return url
      .replace(
        /(^|")(https:\/\/static-cdn.jtvnw.net\/emoticons\/v1\/[^/]+)\/1.0("|$)/g,
        "$1$2/3.0$3"
      )
      .replace(
        /(^|")(https:\/\/static-cdn.jtvnw.net\/emoticons\/v2\/[^/]+\/(?:default|static|animated)\/(?:dark|light))\/1.0("|$)/g,
        "$1$2/3.0$3"
      )
      .replace(
        /(^|")(https:\/\/cdn.betterttv.net\/emote\/[^/]+)\/1x("|$)/g,
        "$1$2/3x$3"
      )
      .replace(
        /(^|")(https:\/\/cdn.7tv.app\/emote\/[^/]+)\/1x.webp("|$)/g,
        "$1$2/4x.webp$3"
      );
  },
  async load(api: ExtensionsApi) {
    api.forClass("badge", HTMLImageElement, this.fixBadges.bind(this));
    api.forClass("emote", HTMLElement, this.fixEmotes.bind(this));
  },
};
