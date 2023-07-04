/*! modified code of FFZ emote modifiers implementation */
/*! https://github.com/FrankerFaceZ/FrankerFaceZ/blob/daa193aa030cc29fd5706351677ddeb9079741ae/src/modules/chat/emotes.js */
/*!
Copyright 2016 Dan Salvato LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { FeaturesApi } from "../features";

interface Effects {
  transformOrigin: string | null;
  transform: string[];
  filter: string[];
  animation: ((effects: Effects) => void)[];
  applyEffects(node: HTMLImageElement): void;
}

class EmoteModifiers {
  private readonly className = "modified-emote";
  private readonly datasetName = "effects";
  private readonly modifiers: Record<string, number> = {
    // data-modifiers -> data-effects
    "720507": 12289, // Hyper
    "720508": 3, // X
    "720509": 5, // Y
    "720510": 2049, // Rainbow
    "720729": 16385, // Cursed
    "720730": 32769, // Jam
    "721137": 65537, // Bounce
  };
  private readonly effects = {
    3: (effects: Effects) => {
      effects.transform.push("scaleX(-1)");
    },
    5: (effects: Effects) => {
      effects.transform.push("scaleY(-1)");
    },
    2049: (effects: Effects) => {
      effects.animation.push((effects) => {
        if (effects.filter.length) {
          return "ffz-effect-rainbow-filter 2s linear infinite";
        } else {
          return "ffz-effect-rainbow 2s linear infinite";
        }
      });
    },
    4097: (effects: Effects) => {
      effects.filter.push(
        "brightness(0.2) sepia(1) brightness(2.2) contrast(3) saturate(8)"
      );
      effects.animation.push((effects) => {
        if (effects.transform.length) {
          return "ffz-effect-shake-transform 0.1s linear infinite";
        } else {
          return "ffz-effect-shake 0.1s linear infinite";
        }
      });
    },
    16385: (effects: Effects) => {
      effects.filter.push("grayscale(1) brightness(0.7) contrast(2.5)");
    },
    32769: (effects: Effects) => {
      effects.animation.push((effects) => {
        if (effects.transform.length) {
          return "ffz-effect-jam-transform 0.6s linear infinite";
        } else {
          return "ffz-effect-jam 0.6s linear infinite";
        }
      });
    },
    65537: (effects: Effects) => {
      effects.transformOrigin = "bottom center";
      effects.animation.push((effects) => {
        if (effects.transform.length) {
          return "ffz-effect-bounce-transform 0.5s linear infinite";
        } else {
          return "ffz-effect-bounce 0.5s linear infinite";
        }
      });
    },
    65541: (effects: Effects) => {
      effects.transform.push("translateY(100%)");
    },
  };
  private getEffect(node: HTMLElement) {
    const match = node.style.backgroundImage.match(
      /(^|")https:\/\/cdn.frankerfacez.com\/emote\/(?<modifiers>[^/]+)\/[^/]+("|$)/
    );
    if (match && match.groups && match.groups.modifiers in this.modifiers) {
      return this.modifiers[match.groups.modifiers];
    }
    return 0;
  }
  private createEffects(effectFlags: number) {
    const effects: Effects = {
      transformOrigin: null,
      filter: [],
      transform: [],
      animation: [],
      applyEffects(node: HTMLImageElement) {
        if (this.filter.length) {
          node.style.setProperty("--ffz-effect-filters", this.filter.join(" "));
          node.style.filter = "var(--ffz-effect-filters)";
        }
        if (this.transformOrigin != null) {
          node.style.transformOrigin = this.transformOrigin;
        }
        if (this.transform.length) {
          node.style.setProperty(
            "--ffz-effect-transforms",
            this.transform.join(" ")
          );
          node.style.transform = "var(--ffz-effect-transforms)";
        }
        if (this.animation.length) {
          node.style.setProperty(
            "--ffz-effect-animations",
            this.animation.map((animation) => animation(this)).join(", ")
          );
          node.style.animation = "var(--ffz-effect-animations)";
        }
      },
    };
    for (const [key, addEffect] of Object.entries(this.effects)) {
      const flags = parseInt(key);
      if ((flags & effectFlags) == flags) {
        addEffect(effects);
      }
    }
    return effects;
  }
  private applyEffects(node: HTMLElement, effectFlags: number) {
    node.classList.add(this.className);
    node.dataset[this.datasetName] = String(effectFlags);
    const effects = this.createEffects(effectFlags);
    [...node.getElementsByTagName("img")].forEach((img) =>
      effects.applyEffects(img)
    );
  }
  applyModifiers(message: HTMLElement) {
    const modifierNodes = [];
    for (const node of message.children) {
      if (!(node instanceof HTMLElement)) {
        continue;
      }
      if (node.className == "emote") {
        const textNodes = [];
        let effectFlags = 0;
        // check for modifiers
        for (
          let modifier = node.nextSibling;
          modifier != null;
          modifier = modifier?.nextSibling ?? null
        ) {
          if (modifier == null) {
            break;
          }
          if (!(modifier instanceof HTMLElement)) {
            continue;
          }

          if (modifier.nodeType == Node.TEXT_NODE) {
            if (modifier.nodeValue == null || modifier.nodeValue.trim() == "") {
              textNodes.push(modifier);
              continue;
            }
          } else if ("className" in modifier && modifier.className == "emote") {
            const effect = this.getEffect(modifier);
            if (effect) {
              effectFlags |= effect;
              textNodes.forEach((modifier) => modifierNodes.push(modifier));
              modifierNodes.push(modifier);
              continue;
            }
          }
          break;
        }
        if (effectFlags != 0) {
          this.applyEffects(node, effectFlags);
        }
      }
    }
    modifierNodes.forEach((modifier) => modifier.replaceWith());
  }
}

export const ffz = {
  emoteModifiers: new EmoteModifiers(),
  replaceMessage(message: HTMLElement) {
    this.emoteModifiers.applyModifiers(message);
  },
  async load(api: FeaturesApi) {
    api.forClass("message", HTMLElement, this.replaceMessage.bind(this));
  },
};
