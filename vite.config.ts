import { resolve } from "node:path";
import { defineConfig } from "vite";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import * as z from "zod/mini";
import { getLicenseFileText } from "generate-license-file";
import defaultSettings from "./src/streamlabs/default-settings.js";

const twemojiPath = resolve(__dirname, "node_modules", "@twemoji", "api");

const twemoji = Object.fromEntries(
  ["LICENSE", "LICENSE-GRAPHICS"].map((name) => [
    name,
    readFileSync(resolve(twemojiPath, name), { encoding: "utf-8" }),
  ]),
);

const tempPath = resolve(
  __dirname,
  "node_modules",
  ".vite-temp",
  "twemoji.txt",
);

if (!existsSync(tempPath)) {
  // there is a race condition here, but that's okay while building the application
  // if an error happens here, try again
  mkdirSync(tempPath, {
    recursive: true,
  });
}

const tempLicensePath = resolve(tempPath, "twemoji.txt");
const tempLicenseContents = Object.entries(twemoji)
  .map(([fileName, contents]) => `# ${fileName}\n\n${contents}\n`)
  .join("");
writeFileSync(tempLicensePath, tempLicenseContents, { encoding: "utf-8" });

const licenseText = await getLicenseFileText("./package.json", {
  replace: {
    // note that every time a new version is released that the twemojiPath folder might contain additional licenses
    "@twemoji/api@17.0.2": tempLicensePath,
  },
  append: ["./COPYING"],
});

unlinkSync(tempLicensePath);

const cssLicenseText = readFileSync("COPYING", { encoding: "utf-8" });

if (licenseText.includes("*/") || cssLicenseText.includes("*/")) {
  throw new Error(`License information contains '*/'`);
}

const footer = `/*!
Bundled license information:
${licenseText}
*/`;

const name = process?.env?.npm_package_name;
if (name == null || name.includes("*/")) {
  throw new Error("Name not found or invalid!");
}
const version = process?.env?.npm_package_version;
if (version == null || version.includes("*/")) {
  throw new Error("Version not found or invalid!");
}

const settings = `
/*!
You can change this like this:

const overrides = {
  "ffz": {
    "emote_id": "other_emote_id", // replace emote
    "emote_id": null, // remove emote
  },
  "bttv": {
    "emote_id": "other_emote_id", // replace emote
    "emote_id": null, // remove emote
  },
  "7tv": {
    "emote_id": "other_emote_id", // replace emote
    "emote_id": null, // remove emote
  }
};
*/
const overrides = {
  "ffz": {
  },
  "bttv": {
  },
  "7tv": {
  }
};
const userAgent = ${JSON.stringify(`${name}/${version} (https://github.com/liquidnya/pronouns-chat)`)};`;

const streamelementsCss = `
@use "sass:meta";
/*! version ${version} */
@import url(https://fonts.googleapis.com/css?family={{fontFamily}}:700);
/*!
${cssLicenseText}
*/
html {
  --padding: {{padding}}px;
  --background-color: rgba(0, 0, 0, 0);
  --font-size: {{fontSize}}px;
  --text-color: {{textColor}};
  --message-hide-delay: {{messageHideDelay}}s;
  --font-family: {{fontFamily}};
}
`;
const streamlabsCss = `
@use "sass:meta";
/*! version ${version} */
@import url(https://fonts.googleapis.com/css?family=Roboto:700);
/*!
${cssLicenseText}
*/
html {
  --padding: {padding}px;
  --background-color: {background_color};
  --font-size: {font_size};
  --text-color: {text_color};
  --message-hide-delay: {message_hide_delay};
  --font-family: "Roboto";
}
`;
const css: Record<string, string> = {
  streamelements: streamelementsCss,
  streamlabs: streamlabsCss,
};
const banner = `${settings}
/*! version ${version} */`;

export default defineConfig(({ mode }) => {
  const supportedModes = ["streamelements", "streamlabs"];
  if (z.enum(supportedModes).safeParse(mode).error) {
    throw new Error(
      `The ${mode} mode is currently not supported.\nPlease use any of the following modes: ${supportedModes.join(", ")}`,
    );
  }
  return {
    build: {
      // as of 2025-05-01 the targets are ["chrome107", "edge107", "firefox104", "safari16"]
      target: "baseline-widely-available",
      lib: {
        entry: [resolve(__dirname, `src/${mode}/custom.ts`)],
        formats: ["iife"],
        name: mode,
        fileName: () => "custom.js",
        cssFileName: "custom",
      },
      // minify is disabled such that it is easier for users of this software to modify the custom.js themselves
      minify: false,
      outDir: mode,
      rollupOptions: {
        output: {
          legalComments: "inline",
          banner:
            mode === "streamlabs"
              ? `const settings = ${JSON.stringify(defaultSettings, null, 2)};\n${banner}`
              : banner,
          footer,
        },
        // remove dependency code that is not needed to reduce file size
        treeshake: true,
      },
    },
    publicDir: resolve(__dirname, `static/${mode}`),
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: css[mode],
        },
      },
    },
  };
});
