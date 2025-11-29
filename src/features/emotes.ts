import type { Context, Emote, Overrides } from "../features";
import type { FeaturesApi } from "../features";

// as of 2023-07-08
const KNOWN_FROGS: Record<string, Record<string, string>> = {
  bttv: {
    "55b6524154eefd53777b2580": "FeelsBirthdayMan",
    "56e9f494fff3cc5c35e5287e": "monkaS",
    "566c9fc265dbbdab32ec053b": "FeelsBadMan",
    "566c9fde65dbbdab32ec053e": "FeelsGoodMan",
    "5733ff12e72c3c0814233e20": "FeelsAmazingMan",
  },
  "7tv": {
    "60e5d610a69fc8d27f2737b7": "Stare",
    "62f9c69136c62011a8c3cb80": "PepePls",
    "647c81cdd4b5d6083e9200fc": "peepoPls",
    "6297ed14d1b61557a52b21cb": "Gayge",
    "63018e81f7723932b45bff60": "peepoHappy",
    "63019cd97f31c2c757a21162": "peepoSad",
    "63045f7dd9bf10a26e1a1d02": "knaDyppaHopeep",
    "63065b00b7e5a120600a2df6": "FeelsStrongMan",
    "63065b70be8c19d70f9d6633": "ppL",
    "63071b80942ffb69e13d700f": "EZ",
    "63071bb9464de28875c52531": "FeelsDankMan",
    "6306606b28f42e96cc0df332": "FeelsWeirdMan",
    "62589908caeec18915c90a9b": "ApuApustaja",
    "630660200e929d2fde44db5b": "FeelsOkayMan",
  },
};

function identity<T>(a: T): T {
  return a;
}

class RemoveImageError extends Error {
  readonly replaceWith: string | undefined;
  constructor(message?: string, replaceWith?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.replaceWith = replaceWith;
  }
}

function overrideString(result: string | null): string {
  if (result == null) {
    throw new RemoveImageError();
  }
  return result;
}

function overrideFunction(
  overrides: Overrides,
  type: keyof Overrides,
  showFrogEmotes: boolean,
): (id: string) => string {
  if (
    !(!showFrogEmotes && type in KNOWN_FROGS) &&
    !(
      overrides != null &&
      type in overrides &&
      overrides[type] != null &&
      Object.keys(overrides[type]).length > 0
    )
  ) {
    return identity<string>;
  }
  const map = overrides[type];
  return (id) => {
    if (id in map) {
      return overrideString(map[id]);
    } else if ("*" in map) {
      return overrideString(map["*"]);
    } else if (!showFrogEmotes) {
      if (type in KNOWN_FROGS && id in KNOWN_FROGS[type]) {
        throw new RemoveImageError("frog", KNOWN_FROGS[type][id]);
      }
    }
    return id;
  };
}

export const emotes = {
  ffz: identity<string>,
  twitch: identity<string>,
  bttv: identity<string>,
  "7tv": identity<string>,
  fixEmote(emote: HTMLElement) {
    emote.style.backgroundImage = this.fixEmoteUrl(emote.style.backgroundImage);
    [...emote.getElementsByTagName("img")].forEach((img) =>
      this.fixEmoteImg(img),
    );
  },
  fixEmoteImg(img: HTMLImageElement) {
    img.src = this.fixEmoteUrl(img.src);
  },
  fixEmoteUrl(url: string) {
    return url
      .replace(
        /(^|")(https:\/\/cdn.frankerfacez.com\/emote\/)([^/]+)\/(1|2|4)("|$)/g,
        (_match, p1, p2, id, _scale, p5) => `${p1}${p2}${this.ffz(id)}/4${p5}`,
      )
      .replace(
        /(^|")(https:\/\/static-cdn.jtvnw.net\/emoticons\/v1\/)([^/]+)\/(1|2|3).0("|$)/g,
        (_match, p1, p2, id, _scale, p5) =>
          `${p1}${p2}${this.twitch(id)}/3.0${p5}`,
      )
      .replace(
        /(^|")(https:\/\/static-cdn.jtvnw.net\/emoticons\/v2\/)([^/]+)(\/(?:default|static|animated)\/(?:dark|light))\/(1|2|3).0("|$)/g,
        (_match, p1, p2, id, p4, _scale, p6) =>
          `${p1}${p2}${this.twitch(id)}${p4}/3.0${p6}`,
      )
      .replace(
        /(^|")(https:\/\/cdn.betterttv.net\/emote\/)([^/]+)\/(1|2|3)x(\.webp|\.gif)?("|$)/g,
        (_match, p1, p2, id, _scale, p5, p6) =>
          `${p1}${p2}${this.bttv(id)}/3x${p5 ?? ""}${p6}`,
      )
      .replace(
        /(^|")(https:\/\/cdn.7tv.app\/emote\/)([^/]+)\/(1|2|3|4)x.webp("|$)/g,
        (_match, p1, p2, id, _scale, p5) =>
          `${p1}${p2}${this["7tv"](id)}/4x.webp${p5}`,
      );
  },
  createEmoteNode(emote: Emote): HTMLElement {
    let url = emote.urls[4];
    if (
      emote.type === "twitch" ||
      emote.type === "ffz" ||
      emote.type === "bttv" ||
      emote.type === "7tv"
    ) {
      const replacedId = this[emote.type](emote.id);
      if (replacedId !== emote.id) {
        url = url.replace(emote.id, replacedId);
      }
    }
    const span = document.createElement("span");
    span.className = "emote";
    span.style.backgroundImage = `url(${url})`;
    const img = document.createElement("img");
    img.src = url;
    span.append(img);
    return span;
  },
  renderText(text: string): Node[] {
    return [document.createTextNode(text)];
  },
  renderMessage(context: Context): Node[] {
    const result = [];
    let index = 0;
    for (const emote of context.emotes) {
      if (emote.start > index) {
        result.push(
          ...this.renderText(context.message.substring(index, emote.start)),
        );
      }
      index = emote.end + 1;
      try {
        result.push(this.createEmoteNode(emote));
      } catch (e) {
        if (e instanceof RemoveImageError) {
          result.push(
            ...this.renderText(
              emote.name ?? context.message.substring(emote.start, index),
            ),
          );
        } else {
          throw e;
        }
      }
    }
    if (context.message.length > index) {
      result.push(
        ...this.renderText(
          context.message.substring(index, context.message.length),
        ),
      );
    }
    return result;
  },
  fixMessage(message: HTMLElement, context: Context) {
    if (context.render) {
      message.replaceChildren(...this.renderMessage(context));
      return;
    }
    let index = 0;
    const words = context.message.trim().split(/\s+/);
    let lastReplacedText: null | Text = null;
    for (const node of message.childNodes) {
      if (
        (node instanceof HTMLElement && node.classList.contains("emote")) || // emote
        node instanceof HTMLImageElement // cheermote
      ) {
        let text = null;
        try {
          this.fixEmote(node);
        } catch (e) {
          if (e instanceof RemoveImageError) {
            text = document.createTextNode(e.replaceWith ?? words[index] ?? "");
            node.replaceWith(text);
          } else {
            throw e;
          }
        }
        index++;
        lastReplacedText = text;
      }
      if (node instanceof Text && node.textContent != null) {
        const text = node.textContent.trim();
        if (text != "") {
          const textWords = text.split(/\s+/);
          // fix !., at the end of emotes
          // maybe this is actually not neccessary...
          if (
            (textWords[0].startsWith("!") ||
              textWords[0].startsWith(".") ||
              textWords[0].startsWith(",")) &&
            lastReplacedText != null &&
            lastReplacedText.textContent != null &&
            lastReplacedText.textContent.endsWith(textWords[0])
          ) {
            lastReplacedText.textContent =
              lastReplacedText.textContent.substring(
                0,
                lastReplacedText.textContent.length - textWords[0].length,
              );
          }
          index += textWords.length;
          lastReplacedText = null;
        }
      }
    }
  },
  async load(api: FeaturesApi) {
    api.forClass("message", HTMLElement, this.fixMessage.bind(this));
    //api.forClass("emote", HTMLElement, this.fixEmote.bind(this));
    this["7tv"] = overrideFunction(
      api.overrides,
      "7tv",
      api.settings.showFrogEmotes,
    );
    this.bttv = overrideFunction(
      api.overrides,
      "bttv",
      api.settings.showFrogEmotes,
    );
    this.ffz = overrideFunction(
      api.overrides,
      "ffz",
      api.settings.showFrogEmotes,
    );
    this.twitch = overrideFunction(
      api.overrides,
      "twitch",
      api.settings.showFrogEmotes,
    );
  },
};
