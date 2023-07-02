import { hasBadContrast, lighten } from "color2k";
import { ExtensionsApi } from "../extensions";

export const nameColor = {
  setNameColors(names: HTMLElement[]) {
    names.forEach((name) => this.setNameColor(name));
  },
  setNameColor(name: HTMLElement) {
    if (name.dataset["color"] != null) {
      let color = name.dataset["color"];
      let count = 0;
      while (hasBadContrast(color, "readable", "black")) {
        color = lighten(color, 0.1);
        count++;
        if (count >= 5) {
          // abort after 5 loops
          break;
        }
      }
      name.style.color = color;
    }
  },
  async load(api: ExtensionsApi) {
    api.forClass("name", HTMLElement, this.setNameColors.bind(this));
  },
};
