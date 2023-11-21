import { FeaturesApi } from "../features";

export const badges = {
  fixBadge(badge: HTMLImageElement) {
    badge.src = this.fixBadgeUrl(badge.src);
  },
  fixBadgeUrl(url: string) {
    return url.replace(
      /(^|")(https:\/\/static-cdn.jtvnw.net\/badges\/v1\/[^/]+)\/1("|$)/g,
      "$1$2/3$3",
    );
  },
  async load(api: FeaturesApi) {
    api.forClass("badge", HTMLImageElement, this.fixBadge.bind(this));
  },
};
