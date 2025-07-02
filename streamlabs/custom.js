const settings = {
  "pronouns": [
    "api.pronouns.alejo.io",
    "pronoundb.org"
  ],
  "showFrogEmotes": true,
  "capitalizePronouns": true
};
const overrides = {
  "ffz": {
    // "emote_id": "other_emote_id", // replace emote
    // "emote_id": null, // remove emote
  },
  "bttv": {
    // "emote_id": "other_emote_id", // replace emote
    // "emote_id": null, // remove emote
  },
  "7tv": {
    // "emote_id": "other_emote_id", // replace emote
    // "emote_id": null, // remove emote
  }
};
const userAgent = "pronouns-chat/7.0.0 (https://github.com/liquidnya/pronouns-chat)";
/*! version 7.0.0 */
(function() {
  "use strict";
  class ClearChat {
    constructor() {
      this.command = "CLEARCHAT";
    }
    handleCommand(detail) {
      const userId = detail.tags["target-user-id"];
      const username = detail.body;
      if (userId == null && username == null) {
        this.removeAllLogs();
      }
      if (userId != null) {
        this.removeAllBySelector('[data-user-id="' + userId + '"]');
      }
      if (username != null) {
        this.removeAllBySelector('[data-from="' + username + '" i]');
      }
    }
    removeAllBySelector(selector) {
      const nodes = document.querySelectorAll(selector);
      nodes.forEach((node) => node.remove());
    }
    removeAllLogs() {
      const elem = document.getElementById("log");
      if (elem != null) {
        elem.replaceChildren();
      }
    }
  }
  class ElementsCollection {
    constructor(selectors) {
      this.elements = [...document.querySelectorAll(selectors)];
    }
    get length() {
      return this.elements.length;
    }
    forEach(action, type) {
      this.elements.forEach((element) => {
        if (type == null || element instanceof type) {
          action(element);
        }
      });
    }
    get(className, type) {
      const elements = this.elements.flatMap((element) => [
        ...element.getElementsByClassName(className)
      ]);
      if (type == null) {
        return elements;
      }
      return elements.filter((element) => element instanceof type);
    }
  }
  function parseTwitchEmotes(emotesTag) {
    return emotesTag.split(/(,|\/)/).flatMap((definition) => {
      const match = /^(?<emoteID>.*):(?<startPosition>[0-9]+)-(?<endPosition>[0-9]+)$/.exec(
        definition.trim()
      );
      if (match == null || match.groups == null) {
        return [];
      }
      const { emoteID, startPosition, endPosition } = match.groups;
      const id = emoteID;
      const start = parseInt(startPosition, 10);
      const end = parseInt(endPosition, 10);
      if (isNaN(start) || isNaN(end)) {
        return [];
      }
      const emote = {
        start,
        end,
        id,
        type: "twitch",
        urls: {
          1: `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/1.0`,
          2: `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/2.0`,
          4: `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/3.0`
        }
      };
      return [emote];
    }).sort((a, b) => a.start - b.start);
  }
  class PrivMsgHandler {
    constructor() {
      this.command = "PRIVMSG";
      this.validUsername = /^[a-z0-9_]{2,}$/;
      this.actions = [];
    }
    addAction(action) {
      this.actions.push(action);
    }
    elements(entries, className) {
      return entries.flatMap((entry) => [
        ...entry.getElementsByClassName(className)
      ]);
    }
    logError(message, detail) {
      console.error(
        message + " for message id " + detail.messageId + " and username " + detail.from
      );
    }
    handleCommand(detail) {
      let elements = new ElementsCollection(
        '[data-id="' + detail.messageId + '"]'
      );
      if (elements.length == 0) {
        elements = new ElementsCollection(
          '[data-from="' + detail.tags["display-name"] + '"]:last-child'
        );
        if (elements.length == 0) {
          this.logError("message div not found", detail);
          return;
        }
      }
      let userId = void 0;
      if ("user-id" in detail.tags) {
        userId = detail.tags["user-id"];
      }
      if (userId == null) {
        this.logError("unknown user id", detail);
      }
      if (userId != null) {
        elements.forEach((entry) => entry.dataset.userId = userId, HTMLElement);
      }
      const username = this.extractUsername(detail);
      if (username == null) {
        this.logError("unknown username", detail);
      }
      const context = {
        message: detail.body,
        user: {
          id: userId,
          name: username ?? void 0,
          displayName: detail.tags["display-name"]
        },
        get emotes() {
          if ("emotes" in detail.tags) {
            return parseTwitchEmotes(detail.tags["emotes"]);
          } else {
            return [];
          }
        },
        // for some reason when the message contains both `<` and `>` the message will be escaped twice
        // so in that case there is a best-effort fix to replace everything with the original message
        // since that is less disrupting for now
        render: detail.body.includes("<") && detail.body.includes(">"),
        service: detail.platform
      };
      this.actions.forEach((action) => action(elements, context));
    }
    extractUsername(detail) {
      if (detail.from.match(this.validUsername)) {
        return detail.from;
      }
      let username = detail.payload.prefix;
      let idx = username.indexOf("!");
      if (idx != -1) {
        username = username.substring(0, idx);
        if (username.match(this.validUsername)) {
          return username;
        }
        username = username.substring(idx + 1);
      }
      idx = username.indexOf("@");
      if (idx != -1) {
        username = username.substring(0, idx);
      }
      if (!username.match(this.validUsername)) {
        return null;
      }
      return username;
    }
  }
  class Handlers {
    constructor(features) {
      this.map = {};
      this.features = features;
    }
    eventReceived(event) {
      if (event instanceof CustomEvent) {
        const handler = this.map[event.detail.command];
        if (handler != null) {
          return handler.handleCommand(event.detail);
        }
      }
    }
    register(handler) {
      this.map[handler.command] = handler;
    }
    async load() {
      const handler = new PrivMsgHandler();
      const api = {
        forClass(className, type, action) {
          handler.addAction((elements, body) => {
            elements.get(className, type).forEach((element) => action(element, body));
          });
        },
        settings,
        overrides
      };
      await Promise.all(this.features.map((feature) => feature.load(api)));
      this.register(handler);
      console.log("ready to meow!");
    }
    async run() {
      this.register(new ClearChat());
      document.addEventListener(
        "onEventReceived",
        (event) => this.eventReceived(event)
      );
      await this.load();
    }
  }
  function guard(low, high, value) {
    return Math.min(Math.max(low, value), high);
  }
  class ColorError extends Error {
    constructor(color) {
      super(`Failed to parse color: "${color}"`);
    }
  }
  var ColorError$1 = ColorError;
  function parseToRgba(color) {
    if (typeof color !== "string") throw new ColorError$1(color);
    if (color.trim().toLowerCase() === "transparent") return [0, 0, 0, 0];
    let normalizedColor = color.trim();
    normalizedColor = namedColorRegex.test(color) ? nameToHex(color) : color;
    const reducedHexMatch = reducedHexRegex.exec(normalizedColor);
    if (reducedHexMatch) {
      const arr = Array.from(reducedHexMatch).slice(1);
      return [...arr.slice(0, 3).map((x) => parseInt(r(x, 2), 16)), parseInt(r(arr[3] || "f", 2), 16) / 255];
    }
    const hexMatch = hexRegex.exec(normalizedColor);
    if (hexMatch) {
      const arr = Array.from(hexMatch).slice(1);
      return [...arr.slice(0, 3).map((x) => parseInt(x, 16)), parseInt(arr[3] || "ff", 16) / 255];
    }
    const rgbaMatch = rgbaRegex.exec(normalizedColor);
    if (rgbaMatch) {
      const arr = Array.from(rgbaMatch).slice(1);
      return [...arr.slice(0, 3).map((x) => parseInt(x, 10)), parseFloat(arr[3] || "1")];
    }
    const hslaMatch = hslaRegex.exec(normalizedColor);
    if (hslaMatch) {
      const [h, s, l, a] = Array.from(hslaMatch).slice(1).map(parseFloat);
      if (guard(0, 100, s) !== s) throw new ColorError$1(color);
      if (guard(0, 100, l) !== l) throw new ColorError$1(color);
      return [...hslToRgb(h, s, l), Number.isNaN(a) ? 1 : a];
    }
    throw new ColorError$1(color);
  }
  function hash(str) {
    let hash2 = 5381;
    let i = str.length;
    while (i) {
      hash2 = hash2 * 33 ^ str.charCodeAt(--i);
    }
    return (hash2 >>> 0) % 2341;
  }
  const colorToInt = (x) => parseInt(x.replace(/_/g, ""), 36);
  const compressedColorMap = "1q29ehhb 1n09sgk7 1kl1ekf_ _yl4zsno 16z9eiv3 1p29lhp8 _bd9zg04 17u0____ _iw9zhe5 _to73___ _r45e31e _7l6g016 _jh8ouiv _zn3qba8 1jy4zshs 11u87k0u 1ro9yvyo 1aj3xael 1gz9zjz0 _3w8l4xo 1bf1ekf_ _ke3v___ _4rrkb__ 13j776yz _646mbhl _nrjr4__ _le6mbhl 1n37ehkb _m75f91n _qj3bzfz 1939yygw 11i5z6x8 _1k5f8xs 1509441m 15t5lwgf _ae2th1n _tg1ugcv 1lp1ugcv 16e14up_ _h55rw7n _ny9yavn _7a11xb_ 1ih442g9 _pv442g9 1mv16xof 14e6y7tu 1oo9zkds 17d1cisi _4v9y70f _y98m8kc 1019pq0v 12o9zda8 _348j4f4 1et50i2o _8epa8__ _ts6senj 1o350i2o 1mi9eiuo 1259yrp0 1ln80gnw _632xcoy 1cn9zldc _f29edu4 1n490c8q _9f9ziet 1b94vk74 _m49zkct 1kz6s73a 1eu9dtog _q58s1rz 1dy9sjiq __u89jo3 _aj5nkwg _ld89jo3 13h9z6wx _qa9z2ii _l119xgq _bs5arju 1hj4nwk9 1qt4nwk9 1ge6wau6 14j9zlcw 11p1edc_ _ms1zcxe _439shk6 _jt9y70f _754zsow 1la40eju _oq5p___ _x279qkz 1fa5r3rv _yd2d9ip _424tcku _8y1di2_ _zi2uabw _yy7rn9h 12yz980_ __39ljp6 1b59zg0x _n39zfzp 1fy9zest _b33k___ _hp9wq92 1il50hz4 _io472ub _lj9z3eo 19z9ykg0 _8t8iu3a 12b9bl4a 1ak5yw0o _896v4ku _tb8k8lv _s59zi6t _c09ze0p 1lg80oqn 1id9z8wb _238nba5 1kq6wgdi _154zssg _tn3zk49 _da9y6tc 1sg7cv4f _r12jvtt 1gq5fmkz 1cs9rvci _lp9jn1c _xw1tdnb 13f9zje6 16f6973h _vo7ir40 _bt5arjf _rc45e4t _hr4e100 10v4e100 _hc9zke2 _w91egv_ _sj2r1kk 13c87yx8 _vqpds__ _ni8ggk8 _tj9yqfb 1ia2j4r4 _7x9b10u 1fc9ld4j 1eq9zldr _5j9lhpx _ez9zl6o _md61fzm".split(" ").reduce((acc, next) => {
    const key = colorToInt(next.substring(0, 3));
    const hex = colorToInt(next.substring(3)).toString(16);
    let prefix = "";
    for (let i = 0; i < 6 - hex.length; i++) {
      prefix += "0";
    }
    acc[key] = `${prefix}${hex}`;
    return acc;
  }, {});
  function nameToHex(color) {
    const normalizedColorName = color.toLowerCase().trim();
    const result = compressedColorMap[hash(normalizedColorName)];
    if (!result) throw new ColorError$1(color);
    return `#${result}`;
  }
  const r = (str, amount) => Array.from(Array(amount)).map(() => str).join("");
  const reducedHexRegex = new RegExp(`^#${r("([a-f0-9])", 3)}([a-f0-9])?$`, "i");
  const hexRegex = new RegExp(`^#${r("([a-f0-9]{2})", 3)}([a-f0-9]{2})?$`, "i");
  const rgbaRegex = new RegExp(`^rgba?\\(\\s*(\\d+)\\s*${r(",\\s*(\\d+)\\s*", 2)}(?:,\\s*([\\d.]+))?\\s*\\)$`, "i");
  const hslaRegex = /^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)$/i;
  const namedColorRegex = /^[a-z]+$/i;
  const roundColor = (color) => {
    return Math.round(color * 255);
  };
  const hslToRgb = (hue, saturation, lightness) => {
    let l = lightness / 100;
    if (saturation === 0) {
      return [l, l, l].map(roundColor);
    }
    const huePrime = (hue % 360 + 360) % 360 / 60;
    const chroma = (1 - Math.abs(2 * l - 1)) * (saturation / 100);
    const secondComponent = chroma * (1 - Math.abs(huePrime % 2 - 1));
    let red = 0;
    let green = 0;
    let blue = 0;
    if (huePrime >= 0 && huePrime < 1) {
      red = chroma;
      green = secondComponent;
    } else if (huePrime >= 1 && huePrime < 2) {
      red = secondComponent;
      green = chroma;
    } else if (huePrime >= 2 && huePrime < 3) {
      green = chroma;
      blue = secondComponent;
    } else if (huePrime >= 3 && huePrime < 4) {
      green = secondComponent;
      blue = chroma;
    } else if (huePrime >= 4 && huePrime < 5) {
      red = secondComponent;
      blue = chroma;
    } else if (huePrime >= 5 && huePrime < 6) {
      red = chroma;
      blue = secondComponent;
    }
    const lightnessModification = l - chroma / 2;
    const finalRed = red + lightnessModification;
    const finalGreen = green + lightnessModification;
    const finalBlue = blue + lightnessModification;
    return [finalRed, finalGreen, finalBlue].map(roundColor);
  };
  function parseToHsla(color) {
    const [red, green, blue, alpha] = parseToRgba(color).map((value, index) => (
      // 3rd index is alpha channel which is already normalized
      index === 3 ? value : value / 255
    ));
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const lightness = (max + min) / 2;
    if (max === min) return [0, 0, lightness, alpha];
    const delta = max - min;
    const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    const hue = 60 * (red === max ? (green - blue) / delta + (green < blue ? 6 : 0) : green === max ? (blue - red) / delta + 2 : (red - green) / delta + 4);
    return [hue, saturation, lightness, alpha];
  }
  function hsla(hue, saturation, lightness, alpha) {
    return `hsla(${(hue % 360).toFixed()}, ${guard(0, 100, saturation * 100).toFixed()}%, ${guard(0, 100, lightness * 100).toFixed()}%, ${parseFloat(guard(0, 1, alpha).toFixed(3))})`;
  }
  function darken(color, amount) {
    const [hue, saturation, lightness, alpha] = parseToHsla(color);
    return hsla(hue, saturation, lightness - amount, alpha);
  }
  function getLuminance(color) {
    if (color === "transparent") return 0;
    function f(x) {
      const channel = x / 255;
      return channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
    }
    const [r2, g, b] = parseToRgba(color);
    return 0.2126 * f(r2) + 0.7152 * f(g) + 0.0722 * f(b);
  }
  function getContrast(color1, color2) {
    const luminance1 = getLuminance(color1);
    const luminance2 = getLuminance(color2);
    return luminance1 > luminance2 ? (luminance1 + 0.05) / (luminance2 + 0.05) : (luminance2 + 0.05) / (luminance1 + 0.05);
  }
  const guidelines = {
    decorative: 1.5,
    readable: 3,
    aa: 4.5,
    aaa: 7
  };
  function hasBadContrast(color, standard = "aa", background = "#fff") {
    return getContrast(color, background) < guidelines[standard];
  }
  function lighten(color, amount) {
    return darken(color, -0.1);
  }
  const nameColor = {
    setNameColor(name) {
      if (name.dataset["color"] != null) {
        let color = name.dataset["color"];
        let count = 0;
        while (hasBadContrast(color, "readable", "black")) {
          color = lighten(color);
          count++;
          if (count >= 5) {
            break;
          }
        }
        name.style.color = color;
      }
    },
    async load(api) {
      api.forClass("name", HTMLElement, this.setNameColor.bind(this));
    }
  };
  const KNOWN_FROGS = {
    bttv: {
      "55b6524154eefd53777b2580": "FeelsBirthdayMan",
      "56e9f494fff3cc5c35e5287e": "monkaS",
      "566c9fc265dbbdab32ec053b": "FeelsBadMan",
      "566c9fde65dbbdab32ec053e": "FeelsGoodMan",
      "5733ff12e72c3c0814233e20": "FeelsAmazingMan"
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
      "630660200e929d2fde44db5b": "FeelsOkayMan"
    }
  };
  function identity(a) {
    return a;
  }
  class RemoveImageError extends Error {
    constructor(message, replaceWith) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
      this.replaceWith = replaceWith;
    }
  }
  function overrideString(result) {
    if (result == null) {
      throw new RemoveImageError();
    }
    return result;
  }
  function overrideFunction(overrides2, type, showFrogEmotes) {
    if (!(!showFrogEmotes && type in KNOWN_FROGS) && !(overrides2 != null && type in overrides2 && overrides2[type] != null && Object.keys(overrides2[type]).length > 0)) {
      return identity;
    }
    const map = overrides2[type];
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
  const emotes = {
    ffz: identity,
    twitch: identity,
    bttv: identity,
    "7tv": identity,
    fixEmote(emote) {
      emote.style.backgroundImage = this.fixEmoteUrl(emote.style.backgroundImage);
      [...emote.getElementsByTagName("img")].forEach(
        (img) => this.fixEmoteImg(img)
      );
    },
    fixEmoteImg(img) {
      img.src = this.fixEmoteUrl(img.src);
    },
    fixEmoteUrl(url) {
      return url.replace(
        /(^|")(https:\/\/cdn.frankerfacez.com\/emote\/)([^/]+)\/(1|2|4)("|$)/g,
        (_match, p1, p2, id, _scale, p5) => `${p1}${p2}${this.ffz(id)}/4${p5}`
      ).replace(
        /(^|")(https:\/\/static-cdn.jtvnw.net\/emoticons\/v1\/)([^/]+)\/(1|2|3).0("|$)/g,
        (_match, p1, p2, id, _scale, p5) => `${p1}${p2}${this.twitch(id)}/3.0${p5}`
      ).replace(
        /(^|")(https:\/\/static-cdn.jtvnw.net\/emoticons\/v2\/)([^/]+)(\/(?:default|static|animated)\/(?:dark|light))\/(1|2|3).0("|$)/g,
        (_match, p1, p2, id, p4, _scale, p6) => `${p1}${p2}${this.twitch(id)}${p4}/3.0${p6}`
      ).replace(
        /(^|")(https:\/\/cdn.betterttv.net\/emote\/)([^/]+)\/(1|2|3)x(\.webp|\.gif)?("|$)/g,
        (_match, p1, p2, id, _scale, p5, p6) => `${p1}${p2}${this.bttv(id)}/3x${p5 ?? ""}${p6}`
      ).replace(
        /(^|")(https:\/\/cdn.7tv.app\/emote\/)([^/]+)\/(1|2|3|4)x.webp("|$)/g,
        (_match, p1, p2, id, _scale, p5) => `${p1}${p2}${this["7tv"](id)}/4x.webp${p5}`
      );
    },
    createEmoteNode(emote) {
      let url = emote.urls[4];
      if (emote.type === "twitch" || emote.type === "ffz" || emote.type === "bttv" || emote.type === "7tv") {
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
    renderText(text) {
      return [document.createTextNode(text)];
    },
    renderMessage(context) {
      const result = [];
      let index = 0;
      for (const emote of context.emotes) {
        if (emote.start > index) {
          result.push(
            ...this.renderText(context.message.substring(index, emote.start))
          );
        }
        index = emote.end + 1;
        try {
          result.push(this.createEmoteNode(emote));
        } catch (e) {
          if (e instanceof RemoveImageError) {
            result.push(
              ...this.renderText(
                emote.name ?? context.message.substring(emote.start, index)
              )
            );
          } else {
            throw e;
          }
        }
      }
      if (context.message.length > index) {
        result.push(
          ...this.renderText(
            context.message.substring(index, context.message.length)
          )
        );
      }
      return result;
    },
    fixMessage(message, context) {
      if (context.render) {
        message.replaceChildren(...this.renderMessage(context));
        return;
      }
      let index = 0;
      const words = context.message.trim().split(/\s+/);
      let lastReplacedText = null;
      for (const node of message.childNodes) {
        if (node instanceof HTMLElement && node.classList.contains("emote") || // emote
        node instanceof HTMLImageElement) {
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
            if ((textWords[0].startsWith("!") || textWords[0].startsWith(".") || textWords[0].startsWith(",")) && lastReplacedText != null && lastReplacedText.textContent != null && lastReplacedText.textContent.endsWith(textWords[0])) {
              lastReplacedText.textContent = lastReplacedText.textContent.substring(
                0,
                lastReplacedText.textContent.length - textWords[0].length
              );
            }
            index += textWords.length;
            lastReplacedText = null;
          }
        }
      }
    },
    async load(api) {
      api.forClass("message", HTMLElement, this.fixMessage.bind(this));
      this["7tv"] = overrideFunction(
        api.overrides,
        "7tv",
        api.settings.showFrogEmotes
      );
      this.bttv = overrideFunction(
        api.overrides,
        "bttv",
        api.settings.showFrogEmotes
      );
      this.ffz = overrideFunction(
        api.overrides,
        "ffz",
        api.settings.showFrogEmotes
      );
      this.twitch = overrideFunction(
        api.overrides,
        "twitch",
        api.settings.showFrogEmotes
      );
    }
  };
  var events = { exports: {} };
  var hasRequiredEvents;
  function requireEvents() {
    if (hasRequiredEvents) return events.exports;
    hasRequiredEvents = 1;
    var R = typeof Reflect === "object" ? Reflect : null;
    var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
      return Function.prototype.apply.call(target, receiver, args);
    };
    var ReflectOwnKeys;
    if (R && typeof R.ownKeys === "function") {
      ReflectOwnKeys = R.ownKeys;
    } else if (Object.getOwnPropertySymbols) {
      ReflectOwnKeys = function ReflectOwnKeys2(target) {
        return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
      };
    } else {
      ReflectOwnKeys = function ReflectOwnKeys2(target) {
        return Object.getOwnPropertyNames(target);
      };
    }
    function ProcessEmitWarning(warning) {
      if (console && console.warn) console.warn(warning);
    }
    var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
      return value !== value;
    };
    function EventEmitter() {
      EventEmitter.init.call(this);
    }
    events.exports = EventEmitter;
    events.exports.once = once;
    EventEmitter.EventEmitter = EventEmitter;
    EventEmitter.prototype._events = void 0;
    EventEmitter.prototype._eventsCount = 0;
    EventEmitter.prototype._maxListeners = void 0;
    var defaultMaxListeners = 10;
    function checkListener(listener) {
      if (typeof listener !== "function") {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
    }
    Object.defineProperty(EventEmitter, "defaultMaxListeners", {
      enumerable: true,
      get: function() {
        return defaultMaxListeners;
      },
      set: function(arg) {
        if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
        }
        defaultMaxListeners = arg;
      }
    });
    EventEmitter.init = function() {
      if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
      }
      this._maxListeners = this._maxListeners || void 0;
    };
    EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
      if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
        throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
      }
      this._maxListeners = n;
      return this;
    };
    function _getMaxListeners(that) {
      if (that._maxListeners === void 0)
        return EventEmitter.defaultMaxListeners;
      return that._maxListeners;
    }
    EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
      return _getMaxListeners(this);
    };
    EventEmitter.prototype.emit = function emit(type) {
      var args = [];
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
      var doError = type === "error";
      var events2 = this._events;
      if (events2 !== void 0)
        doError = doError && events2.error === void 0;
      else if (!doError)
        return false;
      if (doError) {
        var er;
        if (args.length > 0)
          er = args[0];
        if (er instanceof Error) {
          throw er;
        }
        var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
        err.context = er;
        throw err;
      }
      var handler = events2[type];
      if (handler === void 0)
        return false;
      if (typeof handler === "function") {
        ReflectApply(handler, this, args);
      } else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          ReflectApply(listeners[i], this, args);
      }
      return true;
    };
    function _addListener(target, type, listener, prepend) {
      var m;
      var events2;
      var existing;
      checkListener(listener);
      events2 = target._events;
      if (events2 === void 0) {
        events2 = target._events = /* @__PURE__ */ Object.create(null);
        target._eventsCount = 0;
      } else {
        if (events2.newListener !== void 0) {
          target.emit(
            "newListener",
            type,
            listener.listener ? listener.listener : listener
          );
          events2 = target._events;
        }
        existing = events2[type];
      }
      if (existing === void 0) {
        existing = events2[type] = listener;
        ++target._eventsCount;
      } else {
        if (typeof existing === "function") {
          existing = events2[type] = prepend ? [listener, existing] : [existing, listener];
        } else if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
        m = _getMaxListeners(target);
        if (m > 0 && existing.length > m && !existing.warned) {
          existing.warned = true;
          var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
          w.name = "MaxListenersExceededWarning";
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          ProcessEmitWarning(w);
        }
      }
      return target;
    }
    EventEmitter.prototype.addListener = function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    };
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    EventEmitter.prototype.prependListener = function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };
    function onceWrapper() {
      if (!this.fired) {
        this.target.removeListener(this.type, this.wrapFn);
        this.fired = true;
        if (arguments.length === 0)
          return this.listener.call(this.target);
        return this.listener.apply(this.target, arguments);
      }
    }
    function _onceWrap(target, type, listener) {
      var state = { fired: false, wrapFn: void 0, target, type, listener };
      var wrapped = onceWrapper.bind(state);
      wrapped.listener = listener;
      state.wrapFn = wrapped;
      return wrapped;
    }
    EventEmitter.prototype.once = function once2(type, listener) {
      checkListener(listener);
      this.on(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter.prototype.removeListener = function removeListener(type, listener) {
      var list, events2, position, i, originalListener;
      checkListener(listener);
      events2 = this._events;
      if (events2 === void 0)
        return this;
      list = events2[type];
      if (list === void 0)
        return this;
      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = /* @__PURE__ */ Object.create(null);
        else {
          delete events2[type];
          if (events2.removeListener)
            this.emit("removeListener", type, list.listener || listener);
        }
      } else if (typeof list !== "function") {
        position = -1;
        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }
        if (position < 0)
          return this;
        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }
        if (list.length === 1)
          events2[type] = list[0];
        if (events2.removeListener !== void 0)
          this.emit("removeListener", type, originalListener || listener);
      }
      return this;
    };
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
      var listeners, events2, i;
      events2 = this._events;
      if (events2 === void 0)
        return this;
      if (events2.removeListener === void 0) {
        if (arguments.length === 0) {
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
        } else if (events2[type] !== void 0) {
          if (--this._eventsCount === 0)
            this._events = /* @__PURE__ */ Object.create(null);
          else
            delete events2[type];
        }
        return this;
      }
      if (arguments.length === 0) {
        var keys = Object.keys(events2);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === "removeListener") continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
        return this;
      }
      listeners = events2[type];
      if (typeof listeners === "function") {
        this.removeListener(type, listeners);
      } else if (listeners !== void 0) {
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }
      return this;
    };
    function _listeners(target, type, unwrap) {
      var events2 = target._events;
      if (events2 === void 0)
        return [];
      var evlistener = events2[type];
      if (evlistener === void 0)
        return [];
      if (typeof evlistener === "function")
        return unwrap ? [evlistener.listener || evlistener] : [evlistener];
      return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
    }
    EventEmitter.prototype.listeners = function listeners(type) {
      return _listeners(this, type, true);
    };
    EventEmitter.prototype.rawListeners = function rawListeners(type) {
      return _listeners(this, type, false);
    };
    EventEmitter.listenerCount = function(emitter, type) {
      if (typeof emitter.listenerCount === "function") {
        return emitter.listenerCount(type);
      } else {
        return listenerCount.call(emitter, type);
      }
    };
    EventEmitter.prototype.listenerCount = listenerCount;
    function listenerCount(type) {
      var events2 = this._events;
      if (events2 !== void 0) {
        var evlistener = events2[type];
        if (typeof evlistener === "function") {
          return 1;
        } else if (evlistener !== void 0) {
          return evlistener.length;
        }
      }
      return 0;
    }
    EventEmitter.prototype.eventNames = function eventNames() {
      return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
    };
    function arrayClone(arr, n) {
      var copy = new Array(n);
      for (var i = 0; i < n; ++i)
        copy[i] = arr[i];
      return copy;
    }
    function spliceOne(list, index) {
      for (; index + 1 < list.length; index++)
        list[index] = list[index + 1];
      list.pop();
    }
    function unwrapListeners(arr) {
      var ret = new Array(arr.length);
      for (var i = 0; i < ret.length; ++i) {
        ret[i] = arr[i].listener || arr[i];
      }
      return ret;
    }
    function once(emitter, name) {
      return new Promise(function(resolve, reject) {
        function errorListener(err) {
          emitter.removeListener(name, resolver);
          reject(err);
        }
        function resolver() {
          if (typeof emitter.removeListener === "function") {
            emitter.removeListener("error", errorListener);
          }
          resolve([].slice.call(arguments));
        }
        eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
        if (name !== "error") {
          addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
        }
      });
    }
    function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
      if (typeof emitter.on === "function") {
        eventTargetAgnosticAddListener(emitter, "error", handler, flags);
      }
    }
    function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
      if (typeof emitter.on === "function") {
        if (flags.once) {
          emitter.once(name, listener);
        } else {
          emitter.on(name, listener);
        }
      } else if (typeof emitter.addEventListener === "function") {
        emitter.addEventListener(name, function wrapListener(arg) {
          if (flags.once) {
            emitter.removeEventListener(name, wrapListener);
          }
          listener(arg);
        });
      } else {
        throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
      }
    }
    return events.exports;
  }
  var eventsExports = requireEvents();
  class CacheEvents {
    static forward(source, emitter) {
      CacheEvents.ALL.forEach((e) => {
        source.on(e, (...args) => emitter.emit(e, ...args));
      });
    }
  }
  CacheEvents.EXPIRE = "expire";
  CacheEvents.STAT = "stat";
  CacheEvents.ERROR = "error";
  CacheEvents.ALL = [CacheEvents.EXPIRE, CacheEvents.STAT, CacheEvents.ERROR];
  class CacheStats extends eventsExports.EventEmitter {
    constructor() {
      super(...arguments);
      this.map = /* @__PURE__ */ new Map();
    }
    inc(key, amount = 1) {
      if (amount === 0)
        return;
      const prev = this.get(key);
      this.map.set(key, prev + amount);
      try {
        this.emit(CacheEvents.STAT, key, amount, prev);
      } catch (e) {
        console.error(e);
      }
    }
    get(key) {
      return this.map.get(key) || 0;
    }
    reset() {
      this.map.clear();
    }
    toString() {
      return JSON.stringify(this.map, null, 2);
    }
  }
  CacheStats.HIT = "hit";
  CacheStats.MISS = "miss";
  CacheStats.LOAD_SUCCESS = "load_success";
  CacheStats.LOAD_FAIL = "load_failure";
  CacheStats.EXPIRE = "expire";
  CacheStats.ALL = [CacheStats.HIT, CacheStats.MISS, CacheStats.LOAD_SUCCESS, CacheStats.LOAD_FAIL, CacheStats.EXPIRE];
  function asArray(iterable) {
    if (iterable instanceof Array) {
      return iterable;
    }
    return Array.from(iterable);
  }
  function keyCompletablePromiseMapToPromiseContainingMap(keyToPromiseMap) {
    return new Promise((resolve) => {
      const keys = keyToPromiseMap.keys();
      const values = asArray(keyToPromiseMap.values());
      Promise.all(values.map((p) => p.promise)).then((resolvedValues) => {
        const valueMap = /* @__PURE__ */ new Map();
        let i = 0;
        for (let key of keys) {
          let promise = resolvedValues[i++];
          valueMap.set(key, promise);
        }
        resolve(valueMap);
      });
    });
  }
  class CompletablePromise {
    constructor() {
      this._resolved = false;
      this._promise = new Promise((resolve, reject) => {
        this._resolve = resolve;
        this._reject = reject;
      });
    }
    static of(value) {
      const promise = new CompletablePromise();
      value.then((v) => promise.resolve(v)).catch((e) => promise.reject(e));
      return promise;
    }
    static completedPromise(value) {
      const completable = new CompletablePromise();
      completable.resolve(value);
      return completable;
    }
    get promise() {
      return this._promise;
    }
    get resolved() {
      return this._resolved;
    }
    resolve(value) {
      if (this._resolved) {
        return;
      }
      this._resolve(value);
      this._resolved = true;
    }
    reject(reason) {
      if (this._resolved) {
        return;
      }
      this._reject(reason);
      this._resolved = true;
    }
    then(fulfilled, rejected) {
      return this._promise.then((v) => fulfilled(v), (e) => rejected(e));
    }
    catch(rejected) {
      return this._promise.catch((e) => rejected(e));
    }
  }
  class Time {
    static millis(m) {
      return m;
    }
    /**
     * Convert seconds to milliseconds
     */
    static seconds(s) {
      return this.millis(s * 1e3);
    }
    /**
     * Convert minutes to milliseconds
     */
    static minutes(m) {
      return this.seconds(m * 60);
    }
    /**
     * Convert hours to milliseconds
     */
    static hours(h) {
      return this.minutes(h * 60);
    }
    /**
     * Convert days to milliseconds
     */
    static days(d) {
      return this.hours(d * 24);
    }
    /**
     * Get the current time in milliseconds
     */
    static get now() {
      return Date.now();
    }
  }
  const DEFAULT_OPTIONS = {
    expireAfterAccess: 0,
    expireAfterWrite: 0,
    deleteOnExpiration: true,
    expirationInterval: Time.minutes(5),
    recordStats: true
  };
  class CacheBase extends eventsExports.EventEmitter {
    constructor(options) {
      super({});
      this.data = /* @__PURE__ */ new Map();
      this._stats = new CacheStats();
      this._options = { ...DEFAULT_OPTIONS, ...options };
      this.runCleanup();
      CacheEvents.forward(this._stats, this);
    }
    get options() {
      return this._options;
    }
    get stats() {
      return this._stats;
    }
    runCleanup() {
      if (this.options.deleteOnExpiration) {
        this.deleteExpiredEntries();
        if (this.options.expirationInterval > 0) {
          this._cleanupTimeout = setTimeout(() => this.runCleanup(), this.options.expirationInterval);
        }
      }
    }
    stopCleanupTimer() {
      clearTimeout(this._cleanupTimeout);
    }
    deleteExpiredEntries(recordStats = this.options.recordStats) {
      const toDelete = [];
      this.data.forEach((entry) => {
        if (entry.isExpired(this.options)) {
          toDelete.push(entry.getKey());
          try {
            this.emit(CacheEvents.EXPIRE, entry.getKey(), entry.getValue());
          } catch (e) {
            console.error(e);
          }
        }
      });
      toDelete.forEach((k) => this.data.delete(k));
      if (recordStats) {
        this.stats.inc(CacheStats.EXPIRE, toDelete.length);
      }
    }
    ///// GET
    /**
     * Get the raw entry without doing any checks
     */
    getEntryDirect(key) {
      return this.data.get(key);
    }
    /**
     * Get the entry after checking for expiration, or <code>undefined</code> if it doesn't exist or is expired
     */
    getEntryIfPresent(key, recordStats = this.options.recordStats) {
      const entry = this.getEntryDirect(key);
      if (typeof entry === "undefined") {
        if (recordStats) {
          this.stats.inc(CacheStats.MISS);
        }
        return void 0;
      }
      if (entry.isExpired(this.options)) {
        if (this.options.deleteOnExpiration) {
          this.invalidateEntry(key);
          if (recordStats) {
            this.stats.inc(CacheStats.EXPIRE);
          }
        }
        if (recordStats) {
          this.stats.inc(CacheStats.MISS);
        }
        return void 0;
      }
      if (recordStats) {
        this.stats.inc(CacheStats.HIT);
      }
      return entry;
    }
    ///// PUT
    putEntry(key, entry) {
      this.data.set(key, entry);
    }
    ///// INVALIDATE
    invalidateEntry(key) {
      return this.data.delete(key);
    }
    /////
    keys() {
      return asArray(this.data.keys());
    }
    has(key) {
      return this.data.has(key);
    }
    end() {
      this.stopCleanupTimer();
      this.data.clear();
    }
  }
  class Entry {
    constructor(key) {
      this.key = key;
    }
    static fromJson(key, value) {
      const entry = new Entry(key);
      entry.value = value["value"];
      entry.accessTime = value["accessTime"];
      entry.writeTime = value["writeTime"];
      return entry;
    }
    getKey() {
      this.accessTime = Time.now;
      return this.key;
    }
    getValue() {
      this.accessTime = Time.now;
      return this.value;
    }
    setValue(v) {
      this.accessTime = Time.now;
      this.writeTime = Time.now;
      return this.value = v;
    }
    isExpired(options) {
      if (options.expireAfterAccess !== 0) {
        if (Time.now - this.accessTime > options.expireAfterAccess) {
          return true;
        }
      }
      if (options.expireAfterWrite !== 0) {
        if (Time.now - this.writeTime > options.expireAfterWrite) {
          return true;
        }
      }
      return false;
    }
  }
  class SimpleCache extends CacheBase {
    constructor(options) {
      super(options);
    }
    ///// GET
    getIfPresent(key) {
      const entry = this.getEntryIfPresent(key);
      if (typeof entry === "undefined") {
        return void 0;
      }
      return entry.getValue();
    }
    get(key, mappingFunction) {
      return this._get(key, mappingFunction);
    }
    /**
     * @internal
     */
    _get(key, mappingFunction, forceLoad = false) {
      if (!forceLoad) {
        const entry = this.getEntryIfPresent(key);
        if (entry) {
          return entry.getValue();
        }
      }
      if (mappingFunction) {
        const mapped = mappingFunction(key);
        if (mapped) {
          this.put(key, mapped);
        }
        if (this.options.recordStats) {
          if (mapped) {
            this.stats.inc(CacheStats.LOAD_SUCCESS);
          } else {
            this.stats.inc(CacheStats.LOAD_FAIL);
          }
        }
        return mapped;
      }
      return void 0;
    }
    /// GET ALL
    getAllPresentEntries(keys) {
      const map = /* @__PURE__ */ new Map();
      for (let key of keys) {
        let val = this.getEntryIfPresent(key);
        if (typeof val !== "undefined") {
          map.set(key, val);
        }
      }
      return map;
    }
    getAllEntries(keys) {
      return this.getAllPresentEntries(keys);
    }
    getAllPresent(keys) {
      const entryMap = this.getAllPresentEntries(keys);
      const map = /* @__PURE__ */ new Map();
      entryMap.forEach((v, k) => map.set(k, v.getValue()));
      return map;
    }
    getAll(keys, mappingFunction) {
      const keyArray = asArray(keys);
      const present = this.getAllPresent(keys);
      if (mappingFunction && present.size < keyArray.length) {
        const missingKeys = keyArray.filter((k) => !present.has(k));
        if (missingKeys.length > 0) {
          const mapped = mappingFunction(missingKeys);
          this.putAll(mapped);
          const combined = /* @__PURE__ */ new Map();
          present.forEach((v, k) => combined.set(k, v));
          mapped.forEach((v, k) => combined.set(k, v));
          if (this.options.recordStats) {
            this.stats.inc(CacheStats.LOAD_SUCCESS, mapped.size);
            this.stats.inc(CacheStats.LOAD_FAIL, missingKeys.length - mapped.size);
          }
          return combined;
        }
      }
      return present;
    }
    ///// PUT
    put(key, value) {
      let entry = this.getEntryIfPresent(key, false);
      if (typeof entry === "undefined") {
        entry = new Entry(key);
      }
      entry.setValue(value);
      this.putEntry(key, entry);
    }
    putAll(map) {
      map.forEach((v, k) => this.put(k, v));
    }
    ///// INVALIDATE
    invalidate(key) {
      super.invalidateEntry(key);
    }
    invalidateAll(keys) {
      if (!keys) {
        keys = this.keys();
      }
      for (let key of keys) {
        this.invalidate(key);
      }
    }
    refresh(key) {
      return this.getIfPresent(key);
    }
  }
  class LoadingCache extends eventsExports.EventEmitter {
    constructor(options, loader, multiLoader, internalCache) {
      super({});
      if (internalCache) {
        this._cache = internalCache(options);
      } else {
        this._cache = new SimpleCache(options);
      }
      this.loader = loader;
      this.multiLoader = multiLoader;
      CacheEvents.forward(this._cache, this);
    }
    get cache() {
      return this._cache;
    }
    get options() {
      return this.cache.options;
    }
    get stats() {
      return this.cache.stats;
    }
    ///// GET
    getIfPresent(key) {
      return this.cache.getIfPresent(key);
    }
    get(key, mappingFunction, forceLoad = false) {
      return this._get(key, mappingFunction, forceLoad);
    }
    /**
     * @internal
     */
    _get(key, mappingFunction, forceLoad = false) {
      if (!forceLoad) {
        const present = this.getIfPresent(key);
        if (present) {
          return present;
        }
      }
      if (mappingFunction) {
        return this.cache._get(key, mappingFunction, true);
      }
      if (this.loader) {
        return this._get(key, this.loader, true);
      }
      return void 0;
    }
    /// GET ALL
    getAllPresent(keys) {
      return this.cache.getAllPresent(keys);
    }
    getAll(keys, mappingFunction) {
      return this._getAll(keys, mappingFunction);
    }
    /**
     * @internal
     */
    _getAll(keys, mappingFunction) {
      if (mappingFunction) {
        return this.cache.getAll(keys, mappingFunction);
      }
      if (this.multiLoader) {
        return this.cache.getAll(keys, this.multiLoader);
      }
      const present = this.cache.getAllPresent(keys);
      if (this.loader) {
        for (let key of keys) {
          if (!present.has(key)) {
            present.set(key, this.get(key, this.loader));
          }
        }
      }
      return present;
    }
    ///// PUT
    put(key, value) {
      this.cache.put(key, value);
    }
    putAll(map) {
      this.cache.putAll(map);
    }
    ///// INVALIDATE
    invalidate(key) {
      this.cache.invalidate(key);
    }
    invalidateAll(keys) {
      this.cache.invalidateAll(keys);
    }
    refresh(key) {
      return this._get(key, null, true);
    }
    /////
    keys() {
      return this.cache.keys();
    }
    has(key) {
      return this.cache.has(key);
    }
    end() {
      this.cache.end();
    }
  }
  class AsyncLoadingCache extends eventsExports.EventEmitter {
    constructor(options, loader, multiLoader, internalCache) {
      super({});
      if (typeof internalCache !== "undefined") {
        this._cache = internalCache(options);
      } else {
        this._cache = new SimpleCache(options);
      }
      this.loader = loader;
      this.multiLoader = multiLoader;
      CacheEvents.forward(this._cache, this);
    }
    get options() {
      return this.cache.options;
    }
    get cache() {
      return this._cache;
    }
    get stats() {
      return this.cache.stats;
    }
    ///// GET
    getIfPresent(key) {
      return this.cache.getIfPresent(key)?.promise;
    }
    get(key, mappingFunction, forceLoad = false) {
      return this._get(key, mappingFunction, forceLoad);
    }
    /**
     * @internal
     */
    _get(key, mappingFunction, forceLoad = false) {
      if (!forceLoad) {
        const present = this.getIfPresent(key);
        if (present) {
          return present;
        }
      }
      if (mappingFunction) {
        const mapped = mappingFunction(key);
        let mappedPromise;
        if (mapped instanceof Promise) {
          mappedPromise = mapped;
        } else {
          mappedPromise = Promise.resolve(mapped);
        }
        this.cache.put(key, CompletablePromise.of(mappedPromise));
        if (this.options.recordStats) {
          if (mapped) {
            this.stats.inc(CacheStats.LOAD_SUCCESS);
          } else {
            this.stats.inc(CacheStats.LOAD_FAIL);
          }
        }
        return mappedPromise;
      }
      if (this.loader) {
        return this._get(key, this.loader, true);
      }
      return void 0;
    }
    /// GET ALL
    getAllPresent(keys) {
      const present = this.cache.getAllPresent(keys);
      return keyCompletablePromiseMapToPromiseContainingMap(present);
    }
    getAll(keys, mappingFunction) {
      return this._getAll(keys, mappingFunction);
    }
    /**
     * @internal
     */
    _getAll(keys, mappingFunction) {
      const keyArray = asArray(keys);
      const present = this.cache.getAllPresent(keys);
      if (mappingFunction) {
        if (present.size < keyArray.length) {
          const missingKeys = keyArray.filter((k) => !present.has(k));
          if (missingKeys.length > 0) {
            const mapped = mappingFunction(keys);
            let mappedPromise;
            if (mapped instanceof Promise) {
              mappedPromise = mapped;
            } else {
              mappedPromise = Promise.resolve(mapped);
            }
            for (let key of missingKeys) {
              this.cache.put(key, new CompletablePromise());
            }
            return Promise.all([
              keyCompletablePromiseMapToPromiseContainingMap(present),
              mappedPromise
            ]).then(([presentMap, newMap]) => {
              for (let key of missingKeys) {
                this.cache.getIfPresent(key)?.resolve(newMap.get(key));
              }
              const combined = /* @__PURE__ */ new Map();
              presentMap.forEach((v, k) => combined.set(k, v));
              newMap.forEach((v, k) => combined.set(k, v));
              if (this.options.recordStats) {
                this.stats.inc(CacheStats.LOAD_SUCCESS, newMap.size);
                this.stats.inc(CacheStats.LOAD_FAIL, missingKeys.length - newMap.size);
              }
              return combined;
            });
          }
        }
        return keyCompletablePromiseMapToPromiseContainingMap(present);
      }
      if (this.multiLoader) {
        return this.getAll(keys, this.multiLoader);
      }
      if (this.loader) {
        for (let key of keys) {
          if (!present.has(key)) {
            present.set(key, CompletablePromise.of(this.get(key)));
          }
        }
      }
      return keyCompletablePromiseMapToPromiseContainingMap(present);
    }
    put(key, value) {
      if (value instanceof Promise) {
        this.cache.put(key, CompletablePromise.of(value));
      } else {
        this.cache.put(key, CompletablePromise.completedPromise(Promise.resolve(value)));
      }
    }
    putAll(map) {
      map.forEach((v, k) => {
        this.cache.put(k, CompletablePromise.completedPromise(Promise.resolve(v)));
      });
    }
    ///// INVALIDATE
    invalidate(key) {
      this.cache.invalidate(key);
    }
    invalidateAll(keys) {
      this.cache.invalidateAll(keys);
    }
    refresh(key) {
      return this._get(key, null, true);
    }
    /////
    keys() {
      return this.cache.keys();
    }
    has(key) {
      return this.cache.has(key);
    }
    end() {
      this.cache.end();
    }
  }
  class CacheBuilder {
    constructor() {
      this.options = {};
    }
    expireAfterAccess(expireAfterAccess) {
      this.options.expireAfterAccess = expireAfterAccess;
      return this;
    }
    expireAfterWrite(expireAfterWrite) {
      this.options.expireAfterWrite = expireAfterWrite;
      return this;
    }
    deleteOnExpiration(deleteOnExpiration) {
      this.options.deleteOnExpiration = deleteOnExpiration;
      return this;
    }
    expirationInterval(expirationInterval) {
      this.options.expirationInterval = expirationInterval;
      return this;
    }
    recordStats(recordStats) {
      this.options.recordStats = recordStats;
      return this;
    }
    build(loader, multiLoader, loadingInternalCache) {
      if (typeof loader === "undefined") {
        if (loadingInternalCache) {
          return loadingInternalCache(this.options);
        }
        return new SimpleCache(this.options);
      }
      return new LoadingCache(this.options, loader, multiLoader, loadingInternalCache);
    }
    buildAsync(loader, multiLoader, loadingInternalCache) {
      return new AsyncLoadingCache(this.options, loader, multiLoader, loadingInternalCache);
    }
  }
  class Caches extends CacheBuilder {
    constructor() {
      super();
    }
    static builder() {
      return new CacheBuilder();
    }
  }
  function $constructor(name, initializer2, params) {
    function init(inst, def) {
      var _a;
      Object.defineProperty(inst, "_zod", {
        value: inst._zod ?? {},
        enumerable: false
      });
      (_a = inst._zod).traits ?? (_a.traits = /* @__PURE__ */ new Set());
      inst._zod.traits.add(name);
      initializer2(inst, def);
      for (const k in _.prototype) {
        if (!(k in inst))
          Object.defineProperty(inst, k, { value: _.prototype[k].bind(inst) });
      }
      inst._zod.constr = _;
      inst._zod.def = def;
    }
    const Parent = params?.Parent ?? Object;
    class Definition extends Parent {
    }
    Object.defineProperty(Definition, "name", { value: name });
    function _(def) {
      var _a;
      const inst = params?.Parent ? new Definition() : this;
      init(inst, def);
      (_a = inst._zod).deferred ?? (_a.deferred = []);
      for (const fn of inst._zod.deferred) {
        fn();
      }
      return inst;
    }
    Object.defineProperty(_, "init", { value: init });
    Object.defineProperty(_, Symbol.hasInstance, {
      value: (inst) => {
        if (params?.Parent && inst instanceof params.Parent)
          return true;
        return inst?._zod?.traits?.has(name);
      }
    });
    Object.defineProperty(_, "name", { value: name });
    return _;
  }
  class $ZodAsyncError extends Error {
    constructor() {
      super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
    }
  }
  const globalConfig = {};
  function config(newConfig) {
    return globalConfig;
  }
  function jsonStringifyReplacer(_, value) {
    if (typeof value === "bigint")
      return value.toString();
    return value;
  }
  function cached(getter) {
    return {
      get value() {
        {
          const value = getter();
          Object.defineProperty(this, "value", { value });
          return value;
        }
      }
    };
  }
  function cleanRegex(source) {
    const start = source.startsWith("^") ? 1 : 0;
    const end = source.endsWith("$") ? source.length - 1 : source.length;
    return source.slice(start, end);
  }
  function defineLazy(object, key, getter) {
    Object.defineProperty(object, key, {
      get() {
        {
          const value = getter();
          object[key] = value;
          return value;
        }
      },
      set(v) {
        Object.defineProperty(object, key, {
          value: v
          // configurable: true,
        });
      },
      configurable: true
    });
  }
  function assignProp(target, prop, value) {
    Object.defineProperty(target, prop, {
      value,
      writable: true,
      enumerable: true,
      configurable: true
    });
  }
  function randomString(length = 10) {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    let str = "";
    for (let i = 0; i < length; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
  }
  function esc(str) {
    return JSON.stringify(str);
  }
  const captureStackTrace = Error.captureStackTrace ? Error.captureStackTrace : (..._args) => {
  };
  function isObject(data) {
    return typeof data === "object" && data !== null && !Array.isArray(data);
  }
  const allowsEval = cached(() => {
    if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
      return false;
    }
    try {
      const F = Function;
      new F("");
      return true;
    } catch (_) {
      return false;
    }
  });
  function isPlainObject(o) {
    if (isObject(o) === false)
      return false;
    const ctor = o.constructor;
    if (ctor === void 0)
      return true;
    const prot = ctor.prototype;
    if (isObject(prot) === false)
      return false;
    if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
      return false;
    }
    return true;
  }
  function clone(inst, def, params) {
    const cl = new inst._zod.constr(def ?? inst._zod.def);
    if (!def || params?.parent)
      cl._zod.parent = inst;
    return cl;
  }
  function normalizeParams(_params) {
    return {};
  }
  function optionalKeys(shape) {
    return Object.keys(shape).filter((k) => {
      return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
    });
  }
  function aborted(x, startIndex = 0) {
    for (let i = startIndex; i < x.issues.length; i++) {
      if (x.issues[i]?.continue !== true)
        return true;
    }
    return false;
  }
  function prefixIssues(path, issues) {
    return issues.map((iss) => {
      var _a;
      (_a = iss).path ?? (_a.path = []);
      iss.path.unshift(path);
      return iss;
    });
  }
  function unwrapMessage(message) {
    return typeof message === "string" ? message : message?.message;
  }
  function finalizeIssue(iss, ctx, config2) {
    const full = { ...iss, path: iss.path ?? [] };
    if (!iss.message) {
      const message = unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config2.customError?.(iss)) ?? unwrapMessage(config2.localeError?.(iss)) ?? "Invalid input";
      full.message = message;
    }
    delete full.inst;
    delete full.continue;
    if (!ctx?.reportInput) {
      delete full.input;
    }
    return full;
  }
  const initializer = (inst, def) => {
    inst.name = "$ZodError";
    Object.defineProperty(inst, "_zod", {
      value: inst._zod,
      enumerable: false
    });
    Object.defineProperty(inst, "issues", {
      value: def,
      enumerable: false
    });
    Object.defineProperty(inst, "message", {
      get() {
        return JSON.stringify(def, jsonStringifyReplacer, 2);
      },
      enumerable: true
      // configurable: false,
    });
  };
  const $ZodError = $constructor("$ZodError", initializer);
  const $ZodRealError = $constructor("$ZodError", initializer, { Parent: Error });
  const _parse = (_Err) => (schema, value, _ctx, _params) => {
    const ctx = _ctx ? Object.assign(_ctx, { async: false }) : { async: false };
    const result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise) {
      throw new $ZodAsyncError();
    }
    if (result.issues.length) {
      const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
      captureStackTrace(e, _params?.callee);
      throw e;
    }
    return result.value;
  };
  const parse = /* @__PURE__ */ _parse($ZodRealError);
  const _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
    const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
    let result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise)
      result = await result;
    if (result.issues.length) {
      const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
      captureStackTrace(e, params?.callee);
      throw e;
    }
    return result.value;
  };
  const parseAsync = /* @__PURE__ */ _parseAsync($ZodRealError);
  const _safeParse = (_Err) => (schema, value, _ctx) => {
    const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
    const result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise) {
      throw new $ZodAsyncError();
    }
    return result.issues.length ? {
      success: false,
      error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
    } : { success: true, data: result.value };
  };
  const safeParse = /* @__PURE__ */ _safeParse($ZodRealError);
  const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
    const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
    let result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise)
      result = await result;
    return result.issues.length ? {
      success: false,
      error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
    } : { success: true, data: result.value };
  };
  const safeParseAsync = /* @__PURE__ */ _safeParseAsync($ZodRealError);
  const string$1 = (params) => {
    const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
    return new RegExp(`^${regex}$`);
  };
  const boolean$1 = /true|false/i;
  class Doc {
    constructor(args = []) {
      this.content = [];
      this.indent = 0;
      if (this)
        this.args = args;
    }
    indented(fn) {
      this.indent += 1;
      fn(this);
      this.indent -= 1;
    }
    write(arg) {
      if (typeof arg === "function") {
        arg(this, { execution: "sync" });
        arg(this, { execution: "async" });
        return;
      }
      const content = arg;
      const lines = content.split("\n").filter((x) => x);
      const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
      const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
      for (const line of dedented) {
        this.content.push(line);
      }
    }
    compile() {
      const F = Function;
      const args = this?.args;
      const content = this?.content ?? [``];
      const lines = [...content.map((x) => `  ${x}`)];
      return new F(...args, lines.join("\n"));
    }
  }
  const version = {
    major: 4,
    minor: 0,
    patch: 0
  };
  const $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
    var _a;
    inst ?? (inst = {});
    defineLazy(inst._zod, "id", () => def.type + "_" + randomString(10));
    inst._zod.def = def;
    inst._zod.bag = inst._zod.bag || {};
    inst._zod.version = version;
    const checks = [...inst._zod.def.checks ?? []];
    if (inst._zod.traits.has("$ZodCheck")) {
      checks.unshift(inst);
    }
    for (const ch of checks) {
      for (const fn of ch._zod.onattach) {
        fn(inst);
      }
    }
    if (checks.length === 0) {
      (_a = inst._zod).deferred ?? (_a.deferred = []);
      inst._zod.deferred?.push(() => {
        inst._zod.run = inst._zod.parse;
      });
    } else {
      const runChecks = (payload, checks2, ctx) => {
        let isAborted = aborted(payload);
        let asyncResult;
        for (const ch of checks2) {
          if (ch._zod.when) {
            const shouldRun = ch._zod.when(payload);
            if (!shouldRun)
              continue;
          } else if (isAborted) {
            continue;
          }
          const currLen = payload.issues.length;
          const _ = ch._zod.check(payload);
          if (_ instanceof Promise && ctx?.async === false) {
            throw new $ZodAsyncError();
          }
          if (asyncResult || _ instanceof Promise) {
            asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
              await _;
              const nextLen = payload.issues.length;
              if (nextLen === currLen)
                return;
              if (!isAborted)
                isAborted = aborted(payload, currLen);
            });
          } else {
            const nextLen = payload.issues.length;
            if (nextLen === currLen)
              continue;
            if (!isAborted)
              isAborted = aborted(payload, currLen);
          }
        }
        if (asyncResult) {
          return asyncResult.then(() => {
            return payload;
          });
        }
        return payload;
      };
      inst._zod.run = (payload, ctx) => {
        const result = inst._zod.parse(payload, ctx);
        if (result instanceof Promise) {
          if (ctx.async === false)
            throw new $ZodAsyncError();
          return result.then((result2) => runChecks(result2, checks, ctx));
        }
        return runChecks(result, checks, ctx);
      };
    }
    inst["~standard"] = {
      validate: (value) => {
        try {
          const r2 = safeParse(inst, value);
          return r2.success ? { value: r2.data } : { issues: r2.error?.issues };
        } catch (_) {
          return safeParseAsync(inst, value).then((r2) => r2.success ? { value: r2.data } : { issues: r2.error?.issues });
        }
      },
      vendor: "zod",
      version: 1
    };
  });
  const $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
    inst._zod.parse = (payload, _) => {
      if (def.coerce)
        try {
          payload.value = String(payload.value);
        } catch (_2) {
        }
      if (typeof payload.value === "string")
        return payload;
      payload.issues.push({
        expected: "string",
        code: "invalid_type",
        input: payload.value,
        inst
      });
      return payload;
    };
  });
  const $ZodBoolean = /* @__PURE__ */ $constructor("$ZodBoolean", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = boolean$1;
    inst._zod.parse = (payload, _ctx) => {
      if (def.coerce)
        try {
          payload.value = Boolean(payload.value);
        } catch (_) {
        }
      const input = payload.value;
      if (typeof input === "boolean")
        return payload;
      payload.issues.push({
        expected: "boolean",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    };
  });
  const $ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload) => payload;
  });
  function handleArrayResult(result, final, index) {
    if (result.issues.length) {
      final.issues.push(...prefixIssues(index, result.issues));
    }
    final.value[index] = result.value;
  }
  const $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
      const input = payload.value;
      if (!Array.isArray(input)) {
        payload.issues.push({
          expected: "array",
          code: "invalid_type",
          input,
          inst
        });
        return payload;
      }
      payload.value = Array(input.length);
      const proms = [];
      for (let i = 0; i < input.length; i++) {
        const item = input[i];
        const result = def.element._zod.run({
          value: item,
          issues: []
        }, ctx);
        if (result instanceof Promise) {
          proms.push(result.then((result2) => handleArrayResult(result2, payload, i)));
        } else {
          handleArrayResult(result, payload, i);
        }
      }
      if (proms.length) {
        return Promise.all(proms).then(() => payload);
      }
      return payload;
    };
  });
  function handleObjectResult(result, final, key) {
    if (result.issues.length) {
      final.issues.push(...prefixIssues(key, result.issues));
    }
    final.value[key] = result.value;
  }
  function handleOptionalObjectResult(result, final, key, input) {
    if (result.issues.length) {
      if (input[key] === void 0) {
        if (key in input) {
          final.value[key] = void 0;
        } else {
          final.value[key] = result.value;
        }
      } else {
        final.issues.push(...prefixIssues(key, result.issues));
      }
    } else if (result.value === void 0) {
      if (key in input)
        final.value[key] = void 0;
    } else {
      final.value[key] = result.value;
    }
  }
  const $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
    $ZodType.init(inst, def);
    const _normalized = cached(() => {
      const keys = Object.keys(def.shape);
      for (const k of keys) {
        if (!(def.shape[k] instanceof $ZodType)) {
          throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
        }
      }
      const okeys = optionalKeys(def.shape);
      return {
        shape: def.shape,
        keys,
        keySet: new Set(keys),
        numKeys: keys.length,
        optionalKeys: new Set(okeys)
      };
    });
    defineLazy(inst._zod, "propValues", () => {
      const shape = def.shape;
      const propValues = {};
      for (const key in shape) {
        const field = shape[key]._zod;
        if (field.values) {
          propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
          for (const v of field.values)
            propValues[key].add(v);
        }
      }
      return propValues;
    });
    const generateFastpass = (shape) => {
      const doc = new Doc(["shape", "payload", "ctx"]);
      const { keys, optionalKeys: optionalKeys2 } = _normalized.value;
      const parseStr = (key) => {
        const k = esc(key);
        return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
      };
      doc.write(`const input = payload.value;`);
      const ids = /* @__PURE__ */ Object.create(null);
      for (const key of keys) {
        ids[key] = randomString(15);
      }
      doc.write(`const newResult = {}`);
      for (const key of keys) {
        if (optionalKeys2.has(key)) {
          const id = ids[key];
          doc.write(`const ${id} = ${parseStr(key)};`);
          const k = esc(key);
          doc.write(`
        if (${id}.issues.length) {
          if (input[${k}] === undefined) {
            if (${k} in input) {
              newResult[${k}] = undefined;
            }
          } else {
            payload.issues = payload.issues.concat(
              ${id}.issues.map((iss) => ({
                ...iss,
                path: iss.path ? [${k}, ...iss.path] : [${k}],
              }))
            );
          }
        } else if (${id}.value === undefined) {
          if (${k} in input) newResult[${k}] = undefined;
        } else {
          newResult[${k}] = ${id}.value;
        }
        `);
        } else {
          const id = ids[key];
          doc.write(`const ${id} = ${parseStr(key)};`);
          doc.write(`
          if (${id}.issues.length) payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${esc(key)}, ...iss.path] : [${esc(key)}]
          })));`);
          doc.write(`newResult[${esc(key)}] = ${id}.value`);
        }
      }
      doc.write(`payload.value = newResult;`);
      doc.write(`return payload;`);
      const fn = doc.compile();
      return (payload, ctx) => fn(shape, payload, ctx);
    };
    let fastpass;
    const isObject$1 = isObject;
    const jit = !globalConfig.jitless;
    const allowsEval$1 = allowsEval;
    const fastEnabled = jit && allowsEval$1.value;
    const { catchall } = def;
    let value;
    inst._zod.parse = (payload, ctx) => {
      value ?? (value = _normalized.value);
      const input = payload.value;
      if (!isObject$1(input)) {
        payload.issues.push({
          expected: "object",
          code: "invalid_type",
          input,
          inst
        });
        return payload;
      }
      const proms = [];
      if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
        if (!fastpass)
          fastpass = generateFastpass(def.shape);
        payload = fastpass(payload, ctx);
      } else {
        payload.value = {};
        const shape = value.shape;
        for (const key of value.keys) {
          const el = shape[key];
          const r2 = el._zod.run({ value: input[key], issues: [] }, ctx);
          const isOptional = el._zod.optin === "optional" && el._zod.optout === "optional";
          if (r2 instanceof Promise) {
            proms.push(r2.then((r3) => isOptional ? handleOptionalObjectResult(r3, payload, key, input) : handleObjectResult(r3, payload, key)));
          } else if (isOptional) {
            handleOptionalObjectResult(r2, payload, key, input);
          } else {
            handleObjectResult(r2, payload, key);
          }
        }
      }
      if (!catchall) {
        return proms.length ? Promise.all(proms).then(() => payload) : payload;
      }
      const unrecognized = [];
      const keySet = value.keySet;
      const _catchall = catchall._zod;
      const t = _catchall.def.type;
      for (const key of Object.keys(input)) {
        if (keySet.has(key))
          continue;
        if (t === "never") {
          unrecognized.push(key);
          continue;
        }
        const r2 = _catchall.run({ value: input[key], issues: [] }, ctx);
        if (r2 instanceof Promise) {
          proms.push(r2.then((r3) => handleObjectResult(r3, payload, key)));
        } else {
          handleObjectResult(r2, payload, key);
        }
      }
      if (unrecognized.length) {
        payload.issues.push({
          code: "unrecognized_keys",
          keys: unrecognized,
          input,
          inst
        });
      }
      if (!proms.length)
        return payload;
      return Promise.all(proms).then(() => {
        return payload;
      });
    };
  });
  const $ZodRecord = /* @__PURE__ */ $constructor("$ZodRecord", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
      const input = payload.value;
      if (!isPlainObject(input)) {
        payload.issues.push({
          expected: "record",
          code: "invalid_type",
          input,
          inst
        });
        return payload;
      }
      const proms = [];
      if (def.keyType._zod.values) {
        const values = def.keyType._zod.values;
        payload.value = {};
        for (const key of values) {
          if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
            const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
            if (result instanceof Promise) {
              proms.push(result.then((result2) => {
                if (result2.issues.length) {
                  payload.issues.push(...prefixIssues(key, result2.issues));
                }
                payload.value[key] = result2.value;
              }));
            } else {
              if (result.issues.length) {
                payload.issues.push(...prefixIssues(key, result.issues));
              }
              payload.value[key] = result.value;
            }
          }
        }
        let unrecognized;
        for (const key in input) {
          if (!values.has(key)) {
            unrecognized = unrecognized ?? [];
            unrecognized.push(key);
          }
        }
        if (unrecognized && unrecognized.length > 0) {
          payload.issues.push({
            code: "unrecognized_keys",
            input,
            inst,
            keys: unrecognized
          });
        }
      } else {
        payload.value = {};
        for (const key of Reflect.ownKeys(input)) {
          if (key === "__proto__")
            continue;
          const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
          if (keyResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          if (keyResult.issues.length) {
            payload.issues.push({
              origin: "record",
              code: "invalid_key",
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
              input: key,
              path: [key],
              inst
            });
            payload.value[keyResult.value] = keyResult.value;
            continue;
          }
          const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
          if (result instanceof Promise) {
            proms.push(result.then((result2) => {
              if (result2.issues.length) {
                payload.issues.push(...prefixIssues(key, result2.issues));
              }
              payload.value[keyResult.value] = result2.value;
            }));
          } else {
            if (result.issues.length) {
              payload.issues.push(...prefixIssues(key, result.issues));
            }
            payload.value[keyResult.value] = result.value;
          }
        }
      }
      if (proms.length) {
        return Promise.all(proms).then(() => payload);
      }
      return payload;
    };
  });
  const $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.optin = "optional";
    inst._zod.optout = "optional";
    defineLazy(inst._zod, "values", () => {
      return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, void 0]) : void 0;
    });
    defineLazy(inst._zod, "pattern", () => {
      const pattern = def.innerType._zod.pattern;
      return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
    });
    inst._zod.parse = (payload, ctx) => {
      if (payload.value === void 0) {
        return payload;
      }
      return def.innerType._zod.run(payload, ctx);
    };
  });
  const $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
    defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
    defineLazy(inst._zod, "pattern", () => {
      const pattern = def.innerType._zod.pattern;
      return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
    });
    defineLazy(inst._zod, "values", () => {
      return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, null]) : void 0;
    });
    inst._zod.parse = (payload, ctx) => {
      if (payload.value === null)
        return payload;
      return def.innerType._zod.run(payload, ctx);
    };
  });
  function _string(Class, params) {
    return new Class({
      type: "string",
      ...normalizeParams()
    });
  }
  function _boolean(Class, params) {
    return new Class({
      type: "boolean",
      ...normalizeParams()
    });
  }
  function _unknown(Class) {
    return new Class({
      type: "unknown"
    });
  }
  const ZodMiniType = /* @__PURE__ */ $constructor("ZodMiniType", (inst, def) => {
    if (!inst._zod)
      throw new Error("Uninitialized schema in ZodMiniType.");
    $ZodType.init(inst, def);
    inst.def = def;
    inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
    inst.safeParse = (data, params) => safeParse(inst, data, params);
    inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
    inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
    inst.check = (...checks) => {
      return inst.clone(
        {
          ...def,
          checks: [
            ...def.checks ?? [],
            ...checks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch)
          ]
        }
        // { parent: true }
      );
    };
    inst.clone = (_def, params) => clone(inst, _def, params);
    inst.brand = () => inst;
    inst.register = (reg, meta) => {
      reg.add(inst, meta);
      return inst;
    };
  });
  const ZodMiniString = /* @__PURE__ */ $constructor("ZodMiniString", (inst, def) => {
    $ZodString.init(inst, def);
    ZodMiniType.init(inst, def);
  });
  function string(params) {
    return _string(ZodMiniString);
  }
  const ZodMiniBoolean = /* @__PURE__ */ $constructor("ZodMiniBoolean", (inst, def) => {
    $ZodBoolean.init(inst, def);
    ZodMiniType.init(inst, def);
  });
  function boolean(params) {
    return _boolean(ZodMiniBoolean);
  }
  const ZodMiniUnknown = /* @__PURE__ */ $constructor("ZodMiniUnknown", (inst, def) => {
    $ZodUnknown.init(inst, def);
    ZodMiniType.init(inst, def);
  });
  function unknown() {
    return _unknown(ZodMiniUnknown);
  }
  const ZodMiniArray = /* @__PURE__ */ $constructor("ZodMiniArray", (inst, def) => {
    $ZodArray.init(inst, def);
    ZodMiniType.init(inst, def);
  });
  function array(element, params) {
    return new ZodMiniArray({
      type: "array",
      element,
      ...normalizeParams()
    });
  }
  const ZodMiniObject = /* @__PURE__ */ $constructor("ZodMiniObject", (inst, def) => {
    $ZodObject.init(inst, def);
    ZodMiniType.init(inst, def);
    defineLazy(inst, "shape", () => def.shape);
  });
  function looseObject(shape, params) {
    return new ZodMiniObject({
      type: "object",
      // shape: shape as core.$ZodLooseShape,
      get shape() {
        assignProp(this, "shape", { ...shape });
        return this.shape;
      },
      // get optional() {
      //   return util.optionalKeys(shape);
      // },
      catchall: unknown(),
      ...normalizeParams()
    });
  }
  const ZodMiniRecord = /* @__PURE__ */ $constructor("ZodMiniRecord", (inst, def) => {
    $ZodRecord.init(inst, def);
    ZodMiniType.init(inst, def);
  });
  function record(keyType, valueType, params) {
    return new ZodMiniRecord({
      type: "record",
      keyType,
      valueType,
      ...normalizeParams()
    });
  }
  const ZodMiniOptional = /* @__PURE__ */ $constructor("ZodMiniOptional", (inst, def) => {
    $ZodOptional.init(inst, def);
    ZodMiniType.init(inst, def);
  });
  function optional(innerType) {
    return new ZodMiniOptional({
      type: "optional",
      innerType
    });
  }
  const ZodMiniNullable = /* @__PURE__ */ $constructor("ZodMiniNullable", (inst, def) => {
    $ZodNullable.init(inst, def);
    ZodMiniType.init(inst, def);
  });
  function nullable(innerType) {
    return new ZodMiniNullable({
      type: "nullable",
      innerType
    });
  }
  function nullish(innerType) {
    return optional(nullable(innerType));
  }
  const PronounsResponse = record(
    string(),
    looseObject({
      name: string(),
      subject: string(),
      object: nullish(string()),
      singular: boolean()
    })
  );
  const UserResponse = looseObject({
    channel_id: string(),
    channel_login: string(),
    pronoun_id: string(),
    alt_pronoun_id: nullish(string())
  });
  const pronounsService$1 = {
    pronounsApi: "https://api.pronouns.alejo.io/v1/",
    map: null,
    cache: null,
    async getPronouns(userId, username) {
      if (userId == null || username == null) {
        return null;
      }
      if (!await this.loadPronounsMap() || this.cache == null || this.map == null) {
        return null;
      }
      const map = this.map;
      const key = "users/" + username;
      const result = await this.cache.get(key);
      if (result == null) {
        return null;
      }
      const response = UserResponse.safeParse(result);
      if (!response.success) {
        console.error(`error parsing data: ${response.error}`);
        return null;
      }
      if (response.data.channel_id != userId) {
        return null;
      }
      const pronouns = [
        response.data.pronoun_id,
        response.data.alt_pronoun_id
      ].flatMap(
        (item) => item === null || item === void 0 || item === "" || !(item in map) ? [] : [map[item]]
      );
      if (pronouns.length <= 0) {
        return null;
      }
      if (pronouns.length == 1) {
        const [pronoun] = pronouns;
        if (pronoun.singular || pronoun.object === null || pronoun.object === void 0 || pronoun.object === "") {
          return pronoun.subject;
        } else {
          return `${pronoun.subject}/${pronoun.object}`;
        }
      } else {
        return pronouns.map((pronoun) => pronoun.subject).join("/");
      }
    },
    async loadPronounsMap() {
      if (this.map == null) {
        const result = await this.createPronounsMap();
        if (result == null) {
          return false;
        }
        this.map = result;
      }
      return true;
    },
    async createPronounsMap() {
      if (this.cache == null) {
        return null;
      }
      const result = await this.cache.get("pronouns");
      if (result == null) {
        return null;
      }
      const response = PronounsResponse.safeParse(result);
      if (!response.success) {
        console.error(`error parsing data: ${response.error}`);
        return null;
      }
      console.log("pronouns definitions loaded");
      return response.data;
    },
    async fetchPronouns(key) {
      console.log(`loading pronouns: ${key}`);
      try {
        const result = await fetch(this.pronounsApi + key).then(
          (resp) => resp.ok ? resp.json() : null
        );
        console.log(
          `loaded pronouns: ${key} (${result === null ? "empty" : "response"})`
        );
        return result;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async load(api) {
      if (api.settings.pronouns.includes("api.pronouns.alejo.io")) {
        this.map = null;
        this.cache = Caches.builder().expireAfterWrite(Time.minutes(5)).buildAsync((key) => this.fetchPronouns(key));
        void this.loadPronounsMap();
      }
    }
  };
  const LookupResponse = record(
    string(),
    looseObject({
      sets: record(string(), array(string()))
    })
  );
  const subjectToObject = {
    // these are the only ones supported by pronoundb.org as of 2025-04-11
    he: "him",
    it: "its",
    she: "her",
    they: "them",
    // optimistically adding these forms
    ae: "aer",
    e: "em",
    fae: "faer",
    per: "per",
    ve: "ver",
    xe: "xem",
    zie: "hier"
  };
  const capitalize = (value) => value === "" ? "" : value.charAt(0).toUpperCase() + value.slice(1);
  function withResolvers() {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return {
      promise,
      resolve,
      reject
    };
  }
  function createBatch(fetchFn, batchLimit, waitTime = 500) {
    let queue = {
      items: [],
      // start with a queue that is already done
      done: true
    };
    const runFetch = (queue2) => {
      if (!queue2.done) {
        queue2.done = true;
        fetchFn(queue2.items.map((item) => item.key)).then((value) => queue2.items.forEach((item) => item.resolve(value))).catch((reason) => queue2.items.forEach((item) => item.reject(reason)));
      }
    };
    return {
      get(key) {
        const { promise, resolve, reject } = withResolvers();
        const item = {
          key,
          resolve,
          reject
        };
        if (queue.done) {
          queue = {
            items: [item],
            done: false
          };
          const queueInTimer = queue;
          setTimeout(() => runFetch(queueInTimer), waitTime);
        } else {
          queue.items.push(item);
          if (queue.items.length >= batchLimit) {
            runFetch(queue);
          }
        }
        return promise;
      }
    };
  }
  const pronounsService = {
    pronounsApi: "https://pronoundb.org/api/v2/lookup",
    cache: null,
    async getPronouns(userId) {
      if (userId == null) {
        return null;
      }
      if (this.cache == null) {
        return null;
      }
      const result = await this.cache.get(userId);
      if (result == null) {
        return null;
      }
      const response = LookupResponse.safeParse(result);
      if (!response.success) {
        console.error(`error parsing data: ${response.error}`);
        return null;
      }
      if (!(userId in response.data)) {
        return null;
      }
      const sets = response.data[userId].sets;
      if (!("en" in sets)) {
        return null;
      }
      const pronouns = response.data[userId].sets["en"];
      if (pronouns.length <= 0) {
        return null;
      }
      if (pronouns.length == 1) {
        const [pronoun] = pronouns;
        if (!(pronoun in subjectToObject)) {
          return capitalize(pronoun);
        } else {
          return `${capitalize(pronoun)}/${capitalize(subjectToObject[pronoun])}`;
        }
      } else {
        return pronouns.map((pronoun) => capitalize(pronoun)).join("/");
      }
    },
    async fetchPronounsBatch(ids) {
      console.log(`loading pronouns: ${ids.join(",")}`);
      try {
        const url = new URL(this.pronounsApi);
        url.searchParams.append("platform", "twitch");
        url.searchParams.append("ids", ids.join(","));
        const result = await fetch(url, {
          headers: {
            "X-PronounDB-Source": userAgent
          }
        }).then((resp) => resp.ok ? resp.json() : null);
        console.log(
          `loaded pronouns: ${ids.join(",")} (${result === null ? "empty" : "response"})`
        );
        return result;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async load(api) {
      if (api.settings.pronouns.includes("pronoundb.org")) {
        const batch = createBatch(
          (ids) => this.fetchPronounsBatch(ids),
          50
        );
        this.cache = Caches.builder().expireAfterWrite(Time.minutes(5)).buildAsync((id) => batch.get(id));
      }
    }
  };
  const knownServices = {
    "api.pronouns.alejo.io": pronounsService$1,
    "pronoundb.org": pronounsService
  };
  const fontRenderer = {
    getCachedImage(text) {
      return document.createTextNode(text);
    }
  };
  const pronounsReplacer = {
    async replacePronouns(node, userId, username, options) {
      for (const service of options.services) {
        const pronouns = await service.getPronouns(userId, username);
        if (pronouns != null) {
          node.replaceChildren(
            fontRenderer.getCachedImage(
              options.capitalizePronouns ? pronouns : pronouns.toLowerCase()
            )
          );
          break;
        }
      }
    },
    async load(api) {
      if (api.settings.pronouns.length > 0) {
        const services = [];
        for (const pronounsApi of api.settings.pronouns) {
          if (pronounsApi in knownServices) {
            services.push(
              knownServices[pronounsApi]
            );
          }
        }
        api.forClass("pronouns", Element, (nodes, context) => {
          if (context.service.includes("twitch")) {
            this.replacePronouns(nodes, context.user.id, context.user.name, {
              capitalizePronouns: api.settings.capitalizePronouns,
              services
            });
          }
        });
        await Promise.all(services.map((service) => service.load(api)));
      }
    }
  };
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
  class EmoteModifiers {
    constructor() {
      this.className = "modified-emote";
      this.datasetName = "effects";
      this.modifiers = {
        // data-modifiers -> data-effects
        "720507": 12289,
        // Hyper
        "720508": 3,
        // X
        "720509": 5,
        // Y
        "720510": 2049,
        // Rainbow
        "720729": 16385,
        // Cursed
        "720730": 32769,
        // Jam
        "721137": 65537
        // Bounce
      };
      this.effects = {
        3: (effects) => {
          effects.transform.push("scaleX(-1)");
        },
        5: (effects) => {
          effects.transform.push("scaleY(-1)");
        },
        2049: (effects) => {
          effects.animation.push((effects2) => {
            if (effects2.filter.length) {
              return "ffz-effect-rainbow-filter 2s linear infinite";
            } else {
              return "ffz-effect-rainbow 2s linear infinite";
            }
          });
        },
        4097: (effects) => {
          effects.filter.push(
            "brightness(0.2) sepia(1) brightness(2.2) contrast(3) saturate(8)"
          );
          effects.animation.push((effects2) => {
            if (effects2.transform.length) {
              return "ffz-effect-shake-transform 0.1s linear infinite";
            } else {
              return "ffz-effect-shake 0.1s linear infinite";
            }
          });
        },
        16385: (effects) => {
          effects.filter.push("grayscale(1) brightness(0.7) contrast(2.5)");
        },
        32769: (effects) => {
          effects.animation.push((effects2) => {
            if (effects2.transform.length) {
              return "ffz-effect-jam-transform 0.6s linear infinite";
            } else {
              return "ffz-effect-jam 0.6s linear infinite";
            }
          });
        },
        65537: (effects) => {
          effects.transformOrigin = "bottom center";
          effects.animation.push((effects2) => {
            if (effects2.transform.length) {
              return "ffz-effect-bounce-transform 0.5s linear infinite";
            } else {
              return "ffz-effect-bounce 0.5s linear infinite";
            }
          });
        },
        65541: (effects) => {
          effects.transform.push("translateY(100%)");
        }
      };
    }
    getEffect(node) {
      const match = node.style.backgroundImage.match(
        /(^|")https:\/\/cdn.frankerfacez.com\/emote\/(?<modifiers>[^/]+)\/[^/]+("|$)/
      );
      if (match && match.groups && match.groups.modifiers in this.modifiers) {
        return this.modifiers[match.groups.modifiers];
      }
      return 0;
    }
    createEffects(effectFlags) {
      const effects = {
        transformOrigin: null,
        filter: [],
        transform: [],
        animation: [],
        applyEffects(node) {
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
        }
      };
      for (const [key, addEffect] of Object.entries(this.effects)) {
        const flags = parseInt(key);
        if ((flags & effectFlags) == flags) {
          addEffect(effects);
        }
      }
      return effects;
    }
    applyEffects(node, effectFlags) {
      node.classList.add(this.className);
      node.dataset[this.datasetName] = String(effectFlags);
      const effects = this.createEffects(effectFlags);
      [...node.getElementsByTagName("img")].forEach(
        (img) => effects.applyEffects(img)
      );
    }
    applyModifiers(message) {
      const modifierNodes = [];
      for (const node of message.children) {
        if (!(node instanceof HTMLElement)) {
          continue;
        }
        if (node.className == "emote" || node.className == "emoji") {
          const textNodes = [];
          let effectFlags = 0;
          for (let modifier = node.nextSibling; modifier != null; modifier = modifier?.nextSibling ?? null) {
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
                textNodes.forEach((modifier2) => modifierNodes.push(modifier2));
                modifierNodes.push(modifier);
                continue;
              }
            }
            break;
          }
          if (effectFlags != 0) {
            if (node.className == "emoji") {
              const span = document.createElement("span");
              node.replaceWith(span);
              span.append(node);
              this.applyEffects(span, effectFlags);
            } else {
              this.applyEffects(node, effectFlags);
            }
          }
        }
      }
      modifierNodes.forEach((modifier) => modifier.replaceWith());
    }
  }
  const ffz = {
    emoteModifiers: new EmoteModifiers(),
    replaceMessage(message) {
      this.emoteModifiers.applyModifiers(message);
    },
    async load(api) {
      api.forClass("message", HTMLElement, this.replaceMessage.bind(this));
    }
  };
  const badges = {
    fixBadge(badge) {
      badge.src = this.fixBadgeUrl(badge.src);
    },
    fixBadgeUrl(url) {
      return url.replace(
        /(^|")(https:\/\/static-cdn.jtvnw.net\/badges\/v1\/[^/]+)\/1("|$)/g,
        "$1$2/3$3"
      );
    },
    async load(api) {
      api.forClass("badge", HTMLImageElement, this.fixBadge.bind(this));
    }
  };
  /*! Copyright Twitter Inc. and other contributors. Licensed under MIT */
  var twemoji$1 = function() {
    var twemoji2 = { base: "https://cdn.jsdelivr.net/gh/jdecked/twemoji@16.0.1/assets/", ext: ".png", size: "72x72", className: "emoji", convert: { fromCodePoint, toCodePoint }, onerror: function onerror() {
      if (this.parentNode) {
        this.parentNode.replaceChild(createText(this.alt, false), this);
      }
    }, parse: parse2, replace, test }, escaper = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }, re = /(?:\ud83d\udc68\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffc-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb\udffd-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb-\udffd\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb-\udffe]|\ud83d\udc68\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc68\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc68\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffc-\udfff]|\ud83e\uddd1\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb\udffd-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb-\udffd\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83e\udef1\ud83c\udffb\u200d\ud83e\udef2\ud83c[\udffc-\udfff]|\ud83e\udef1\ud83c\udffc\u200d\ud83e\udef2\ud83c[\udffb\udffd-\udfff]|\ud83e\udef1\ud83c\udffd\u200d\ud83e\udef2\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\udef1\ud83c\udffe\u200d\ud83e\udef2\ud83c[\udffb-\udffd\udfff]|\ud83e\udef1\ud83c\udfff\u200d\ud83e\udef2\ud83c[\udffb-\udffe]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1|\ud83d\udc6b\ud83c[\udffb-\udfff]|\ud83d\udc6c\ud83c[\udffb-\udfff]|\ud83d\udc6d\ud83c[\udffb-\udfff]|\ud83d\udc8f\ud83c[\udffb-\udfff]|\ud83d\udc91\ud83c[\udffb-\udfff]|\ud83e\udd1d\ud83c[\udffb-\udfff]|\ud83d[\udc6b-\udc6d\udc8f\udc91]|\ud83e\udd1d)|(?:\ud83d[\udc68\udc69]|\ud83e\uddd1)(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf7c\udf84\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddaf-\uddb3\uddbc\uddbd])|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc70\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddcd-\uddcf\uddd4\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|(?:\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83d\ude36\u200d\ud83c\udf2b\ufe0f|\u2764\ufe0f\u200d\ud83d\udd25|\u2764\ufe0f\u200d\ud83e\ude79|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc15\u200d\ud83e\uddba|\ud83d\udc3b\u200d\u2744\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83d\ude2e\u200d\ud83d\udca8|\ud83d\ude35\u200d\ud83d\udcab|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f|\ud83d\udc08\u200d\u2b1b|\ud83d\udc26\u200d\u2b1b)|[#*0-9]\ufe0f?\u20e3|(?:[©®\u2122\u265f]\ufe0f)|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u203c\u2049\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26a7\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|\ud83e\udef0|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|(?:\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd0c\udd0f\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\udd77\uddb5\uddb6\uddb8\uddb9\uddbb\uddcd-\uddcf\uddd1-\udddd\udec3-\udec5\udef1-\udef8]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udc8e\udc90\udc92-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\uded5-\uded7\udedc-\udedf\udeeb\udeec\udef4-\udefc\udfe0-\udfeb\udff0]|\ud83e[\udd0d\udd0e\udd10-\udd17\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd3f-\udd45\udd47-\udd76\udd78-\uddb4\uddb7\uddba\uddbc-\uddcc\uddd0\uddde-\uddff\ude70-\ude7c\ude80-\ude88\ude90-\udebd\udebf-\udec2\udece-\udedb\udee0-\udee8]|[\u23e9-\u23ec\u23f0\u23f3\u267e\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f/g, UFE0Fg = /\uFE0F/g, U200D = String.fromCharCode(8205), rescaper = /[&<>'"]/g, shouldntBeParsed = /^(?:iframe|noframes|noscript|script|select|style|textarea)$/, fromCharCode = String.fromCharCode;
    return twemoji2;
    function createText(text, clean) {
      return document.createTextNode(clean ? text.replace(UFE0Fg, "") : text);
    }
    function escapeHTML(s) {
      return s.replace(rescaper, replacer);
    }
    function defaultImageSrcGenerator(icon, options) {
      return "".concat(options.base, options.size, "/", icon, options.ext);
    }
    function grabAllTextNodes(node, allText) {
      var childNodes = node.childNodes, length = childNodes.length, subnode, nodeType;
      while (length--) {
        subnode = childNodes[length];
        nodeType = subnode.nodeType;
        if (nodeType === 3) {
          allText.push(subnode);
        } else if (nodeType === 1 && !("ownerSVGElement" in subnode) && !shouldntBeParsed.test(subnode.nodeName.toLowerCase())) {
          grabAllTextNodes(subnode, allText);
        }
      }
      return allText;
    }
    function grabTheRightIcon(rawText) {
      return toCodePoint(rawText.indexOf(U200D) < 0 ? rawText.replace(UFE0Fg, "") : rawText);
    }
    function parseNode(node, options) {
      var allText = grabAllTextNodes(node, []), length = allText.length, attrib, attrname, modified, fragment, subnode, text, match, i, index, img, rawText, iconId, src;
      while (length--) {
        modified = false;
        fragment = document.createDocumentFragment();
        subnode = allText[length];
        text = subnode.nodeValue;
        i = 0;
        while (match = re.exec(text)) {
          index = match.index;
          if (index !== i) {
            fragment.appendChild(createText(text.slice(i, index), true));
          }
          rawText = match[0];
          iconId = grabTheRightIcon(rawText);
          i = index + rawText.length;
          src = options.callback(iconId, options);
          if (iconId && src) {
            img = new Image();
            img.onerror = options.onerror;
            img.setAttribute("draggable", "false");
            attrib = options.attributes(rawText, iconId);
            for (attrname in attrib) {
              if (attrib.hasOwnProperty(attrname) && attrname.indexOf("on") !== 0 && !img.hasAttribute(attrname)) {
                img.setAttribute(attrname, attrib[attrname]);
              }
            }
            img.className = options.className;
            img.alt = rawText;
            img.src = src;
            modified = true;
            fragment.appendChild(img);
          }
          if (!img) fragment.appendChild(createText(rawText, false));
          img = null;
        }
        if (modified) {
          if (i < text.length) {
            fragment.appendChild(createText(text.slice(i), true));
          }
          subnode.parentNode.replaceChild(fragment, subnode);
        }
      }
      return node;
    }
    function parseString(str, options) {
      return replace(str, function(rawText) {
        var ret = rawText, iconId = grabTheRightIcon(rawText), src = options.callback(iconId, options), attrib, attrname;
        if (iconId && src) {
          ret = "<img ".concat('class="', options.className, '" ', 'draggable="false" ', 'alt="', rawText, '"', ' src="', src, '"');
          attrib = options.attributes(rawText, iconId);
          for (attrname in attrib) {
            if (attrib.hasOwnProperty(attrname) && attrname.indexOf("on") !== 0 && ret.indexOf(" " + attrname + "=") === -1) {
              ret = ret.concat(" ", attrname, '="', escapeHTML(attrib[attrname]), '"');
            }
          }
          ret = ret.concat("/>");
        }
        return ret;
      });
    }
    function replacer(m) {
      return escaper[m];
    }
    function returnNull() {
      return null;
    }
    function toSizeSquaredAsset(value) {
      return typeof value === "number" ? value + "x" + value : value;
    }
    function fromCodePoint(codepoint) {
      var code = typeof codepoint === "string" ? parseInt(codepoint, 16) : codepoint;
      if (code < 65536) {
        return fromCharCode(code);
      }
      code -= 65536;
      return fromCharCode(55296 + (code >> 10), 56320 + (code & 1023));
    }
    function parse2(what, how) {
      if (!how || typeof how === "function") {
        how = { callback: how };
      }
      return (typeof what === "string" ? parseString : parseNode)(what, { callback: how.callback || defaultImageSrcGenerator, attributes: typeof how.attributes === "function" ? how.attributes : returnNull, base: typeof how.base === "string" ? how.base : twemoji2.base, ext: how.ext || twemoji2.ext, size: how.folder || toSizeSquaredAsset(how.size || twemoji2.size), className: how.className || twemoji2.className, onerror: how.onerror || twemoji2.onerror });
    }
    function replace(text, callback) {
      return String(text).replace(re, callback);
    }
    function test(text) {
      re.lastIndex = 0;
      var result = re.test(text);
      re.lastIndex = 0;
      return result;
    }
    function toCodePoint(unicodeSurrogates, sep) {
      var r2 = [], c = 0, p = 0, i = 0;
      while (i < unicodeSurrogates.length) {
        c = unicodeSurrogates.charCodeAt(i++);
        if (p) {
          r2.push((65536 + (p - 55296 << 10) + (c - 56320)).toString(16));
          p = 0;
        } else if (55296 <= c && c <= 56319) {
          p = c;
        } else {
          r2.push(c.toString(16));
        }
      }
      return r2.join(sep || "-");
    }
  }();
  const twemoji = {
    replaceMessage(message) {
      twemoji$1.parse(message);
    },
    async load(api) {
      api.forClass("message", HTMLElement, this.replaceMessage.bind(this));
    }
  };
  const fixDisplayName = {
    fixDisplayName(name) {
      for (const node of name.childNodes) {
        if (node instanceof Text && node.textContent != null) {
          node.textContent = node.textContent.replace("\\s", " ");
        }
      }
    },
    async load(api) {
      api.forClass("name", HTMLElement, this.fixDisplayName.bind(this));
    }
  };
  const handlers = new Handlers([
    fixDisplayName,
    nameColor,
    emotes,
    twemoji,
    ffz,
    badges,
    pronounsReplacer
  ]);
  handlers.run();
})();
/*!
Bundled license information:
- @discordapp/twemoji@16.0.1:
Licensed under MIT AND CC-BY-4.0.
Repository: https://github.com/discord/twemoji
MIT License

Copyright (c) 2022–present Jason Sofonia & Justine De Caires
Copyright (c) 2014–2021 Twitter

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

- @inventivetalent/loading-cache@0.7.1:
Published by Haylee Schäfer and licensed under MIT.
Repository: https://github.com/InventivetalentDev/loading-cache
MIT License

Copyright (c) 2020 Haylee Schäfer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

- @inventivetalent/time@1.0.3:
Published by Haylee Schäfer and licensed under MIT.

MIT License

Copyright (c) 2021 Haylee Schäfer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

- @twemoji/parser@16.0.0:
Licensed under MIT.
Repository: https://github.com/jdecked/twemoji-parser
MIT License

Copyright (c) 2022–present Jason Sofonia & Justine De Caires
Copyright (c) 2018–2021 Twitter

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

- animate.css@4.1.1:
Published by Animate.css and licensed under MIT.
Repository: https://github.com/animate-css/animate.css
The MIT License (MIT)

Copyright (c) 2020 Daniel Eden

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

- color2k@2.0.3:
Published by Rico Kahler and licensed under MIT.
Repository: https://github.com/ricokahler/color2k
MIT License

Copyright (c) 2020 Rico Kahler

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

- events@3.3.0:
Published by Irakli Gozalishvili and licensed under MIT.
Repository: https://github.com/Gozala/events
MIT

Copyright Joyent, Inc. and other Node contributors.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
USE OR OTHER DEALINGS IN THE SOFTWARE.

- fs-extra@8.1.0:
Published by JP Richardson and licensed under MIT.
Repository: https://github.com/jprichardson/node-fs-extra
(The MIT License)

Copyright (c) 2011-2017 JP Richardson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
(the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify,
 merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

- graceful-fs@4.2.11:
Licensed under ISC.
Repository: https://github.com/isaacs/node-graceful-fs
The ISC License

Copyright (c) 2011-2022 Isaac Z. Schlueter, Ben Noordhuis, and Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR
IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

- hash-it@6.0.0:
Published by planttheidea and licensed under MIT.
Repository: https://github.com/planttheidea/hash-it
The MIT License (MIT)

Copyright (c) 2015 Plant The Idea

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


- jsonfile@4.0.0:
Published by JP Richardson and licensed under MIT.
Repository: https://github.com/jprichardson/node-jsonfile
(The MIT License)

Copyright (c) 2012-2015, JP Richardson <jprichardson@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
(the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify,
 merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

- jsonfile@5.0.0:
Published by JP Richardson and licensed under MIT.
Repository: https://github.com/jprichardson/node-jsonfile
(The MIT License)

Copyright (c) 2012-2015, JP Richardson <jprichardson@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
(the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify,
 merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

- pronouns-chat@7.0.0:
Licensed under MIT*.

The following files have their license information within the file itself:
- src/features/ffz.ts
- src/features/ffz.css
- streamlabs/custom.css
- streamlabs/custom.js
- streamelements/custom.css
- streamelements/custom.js

All other fies are distributed under the following license:

MIT License

Copyright (c) 2023 Nya

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

- typescript@4.9.5:
Published by Microsoft Corp. and licensed under Apache-2.0.
Repository: https://github.com/Microsoft/TypeScript
Apache License

Version 2.0, January 2004

http://www.apache.org/licenses/ 

TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

1. Definitions.

"License" shall mean the terms and conditions for use, reproduction, and distribution as defined by Sections 1 through 9 of this document.

"Licensor" shall mean the copyright owner or entity authorized by the copyright owner that is granting the License.

"Legal Entity" shall mean the union of the acting entity and all other entities that control, are controlled by, or are under common control with that entity. For the purposes of this definition, "control" means (i) the power, direct or indirect, to cause the direction or management of such entity, whether by contract or otherwise, or (ii) ownership of fifty percent (50%) or more of the outstanding shares, or (iii) beneficial ownership of such entity.

"You" (or "Your") shall mean an individual or Legal Entity exercising permissions granted by this License.

"Source" form shall mean the preferred form for making modifications, including but not limited to software source code, documentation source, and configuration files.

"Object" form shall mean any form resulting from mechanical transformation or translation of a Source form, including but not limited to compiled object code, generated documentation, and conversions to other media types.

"Work" shall mean the work of authorship, whether in Source or Object form, made available under the License, as indicated by a copyright notice that is included in or attached to the work (an example is provided in the Appendix below).

"Derivative Works" shall mean any work, whether in Source or Object form, that is based on (or derived from) the Work and for which the editorial revisions, annotations, elaborations, or other modifications represent, as a whole, an original work of authorship. For the purposes of this License, Derivative Works shall not include works that remain separable from, or merely link (or bind by name) to the interfaces of, the Work and Derivative Works thereof.

"Contribution" shall mean any work of authorship, including the original version of the Work and any modifications or additions to that Work or Derivative Works thereof, that is intentionally submitted to Licensor for inclusion in the Work by the copyright owner or by an individual or Legal Entity authorized to submit on behalf of the copyright owner. For the purposes of this definition, "submitted" means any form of electronic, verbal, or written communication sent to the Licensor or its representatives, including but not limited to communication on electronic mailing lists, source code control systems, and issue tracking systems that are managed by, or on behalf of, the Licensor for the purpose of discussing and improving the Work, but excluding communication that is conspicuously marked or otherwise designated in writing by the copyright owner as "Not a Contribution."

"Contributor" shall mean Licensor and any individual or Legal Entity on behalf of whom a Contribution has been received by Licensor and subsequently incorporated within the Work.

2. Grant of Copyright License. Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable copyright license to reproduce, prepare Derivative Works of, publicly display, publicly perform, sublicense, and distribute the Work and such Derivative Works in Source or Object form.

3. Grant of Patent License. Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable (except as stated in this section) patent license to make, have made, use, offer to sell, sell, import, and otherwise transfer the Work, where such license applies only to those patent claims licensable by such Contributor that are necessarily infringed by their Contribution(s) alone or by combination of their Contribution(s) with the Work to which such Contribution(s) was submitted. If You institute patent litigation against any entity (including a cross-claim or counterclaim in a lawsuit) alleging that the Work or a Contribution incorporated within the Work constitutes direct or contributory patent infringement, then any patent licenses granted to You under this License for that Work shall terminate as of the date such litigation is filed.

4. Redistribution. You may reproduce and distribute copies of the Work or Derivative Works thereof in any medium, with or without modifications, and in Source or Object form, provided that You meet the following conditions:

You must give any other recipients of the Work or Derivative Works a copy of this License; and

You must cause any modified files to carry prominent notices stating that You changed the files; and

You must retain, in the Source form of any Derivative Works that You distribute, all copyright, patent, trademark, and attribution notices from the Source form of the Work, excluding those notices that do not pertain to any part of the Derivative Works; and

If the Work includes a "NOTICE" text file as part of its distribution, then any Derivative Works that You distribute must include a readable copy of the attribution notices contained within such NOTICE file, excluding those notices that do not pertain to any part of the Derivative Works, in at least one of the following places: within a NOTICE text file distributed as part of the Derivative Works; within the Source form or documentation, if provided along with the Derivative Works; or, within a display generated by the Derivative Works, if and wherever such third-party notices normally appear. The contents of the NOTICE file are for informational purposes only and do not modify the License. You may add Your own attribution notices within Derivative Works that You distribute, alongside or as an addendum to the NOTICE text from the Work, provided that such additional attribution notices cannot be construed as modifying the License. You may add Your own copyright statement to Your modifications and may provide additional or different license terms and conditions for use, reproduction, or distribution of Your modifications, or for any such Derivative Works as a whole, provided Your use, reproduction, and distribution of the Work otherwise complies with the conditions stated in this License.

5. Submission of Contributions. Unless You explicitly state otherwise, any Contribution intentionally submitted for inclusion in the Work by You to the Licensor shall be under the terms and conditions of this License, without any additional terms or conditions. Notwithstanding the above, nothing herein shall supersede or modify the terms of any separate license agreement you may have executed with Licensor regarding such Contributions.

6. Trademarks. This License does not grant permission to use the trade names, trademarks, service marks, or product names of the Licensor, except as required for reasonable and customary use in describing the origin of the Work and reproducing the content of the NOTICE file.

7. Disclaimer of Warranty. Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its Contributions) on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE. You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated with Your exercise of permissions under this License.

8. Limitation of Liability. In no event and under no legal theory, whether in tort (including negligence), contract, or otherwise, unless required by applicable law (such as deliberate and grossly negligent acts) or agreed to in writing, shall any Contributor be liable to You for damages, including any direct, indirect, special, incidental, or consequential damages of any character arising as a result of this License or out of the use or inability to use the Work (including but not limited to damages for loss of goodwill, work stoppage, computer failure or malfunction, or any and all other commercial damages or losses), even if such Contributor has been advised of the possibility of such damages.

9. Accepting Warranty or Additional Liability. While redistributing the Work or Derivative Works thereof, You may choose to offer, and charge a fee for, acceptance of support, warranty, indemnity, or other liability obligations and/or rights consistent with this License. However, in accepting such obligations, You may act only on Your own behalf and on Your sole responsibility, not on behalf of any other Contributor, and only if You agree to indemnify, defend, and hold each Contributor harmless for any liability incurred by, or claims asserted against, such Contributor by reason of your accepting any such warranty or additional liability.

END OF TERMS AND CONDITIONS

- universalify@0.1.2:
Published by Ryan Zimmerman and licensed under MIT.
Repository: https://github.com/RyanZim/universalify
(The MIT License)

Copyright (c) 2017, Ryan Zimmerman <opensrc@ryanzim.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

- zod@3.25.68:
Published by Colin McDonnell and licensed under MIT.
Repository: https://github.com/colinhacks/zod
MIT License

Copyright (c) 2025 Colin McDonnell

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
