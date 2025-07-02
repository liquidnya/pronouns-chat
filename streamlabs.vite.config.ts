import { resolve } from "node:path";
import { defineConfig } from "vite";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import defaultSettings from "./src/streamlabs/default-settings.js";

const licenses = JSON.parse(
  execSync("npx license-checker --production --json").toString("utf-8"),
);

const licenseText = Object.entries(licenses)
  .map(([library, info]) => {
    let repository = "";
    let license = "";
    let published = "";
    if (info != null && typeof info === "object") {
      if ("repository" in info) {
        repository = "Repository: " + String(info["repository"]);
      }
      if ("licenseFile" in info) {
        license = readFileSync(String(info["licenseFile"]), {
          encoding: "utf8",
        });
      }
      if ("publisher" in info) {
        published = "Published by " + String(info["publisher"]);
      }
      if ("licenses" in info) {
        if (published == "") {
          published = `Licensed under ${info["licenses"]}`;
        } else {
          published += ` and licensed under ${info["licenses"]}`;
        }
      }
    }
    if (published != "") {
      published += ".\n";
    }
    return `- ${library}:\n${published}${repository}\n${license}`;
  })
  .join("\n");

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

const settings = `const settings = ${JSON.stringify(defaultSettings, null, 2)};
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
const userAgent = ${JSON.stringify(`${name}/${version} (https://github.com/liquidnya/pronouns-chat)`)};`;

const banner = `${settings}
/*! version ${version} */`;

const additionalData = `
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

export default defineConfig({
  build: {
    lib: {
      entry: [resolve(__dirname, "src/streamlabs/custom.ts")],
      formats: ["iife"],
      name: "streamlabs",
      fileName: () => "custom.js",
      cssFileName: "custom",
    },
    minify: false,
    outDir: "streamlabs",
    rollupOptions: {
      output: {
        banner,
        footer,
      },
    },
  },
  publicDir: resolve(__dirname, "static/streamlabs"),
  css: {
    preprocessorOptions: {
      scss: {
        additionalData,
      },
    },
  },
  plugins: [],
});
