import { FeaturesApi } from "../features";

export const fixDisplayName = {
  fixDisplayName(name: HTMLElement) {
    for (const node of name.childNodes) {
      if (node instanceof Text && node.textContent != null) {
        // some users have \s in their display name
        // looks like this on IRC: `display-name=DisplayName\\s;`
        // only fix rendering the display name on-screen, but keep the display name as-is
        node.textContent = node.textContent.replace("\\s", " ");
      }
    }
  },
  async load(api: FeaturesApi) {
    api.forClass("name", HTMLElement, this.fixDisplayName.bind(this));
  },
};
