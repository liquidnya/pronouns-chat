import { hasBadContrast, lighten } from "color2k";
import { FeaturesApi } from "../features";

export const nameColor = {
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
  async load(api: FeaturesApi) {
    api.forClass("name", HTMLElement, this.setNameColor.bind(this));
  },
};
