import * as esbuild from "esbuild";
import defaultSettings from "../src/streamlabs/default-settings.js";
import { execSync } from "child_process";
import { readFileSync } from "fs";
import { sassPlugin } from "esbuild-sass-plugin";
import copyStaticFiles from "esbuild-copy-static-files";

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

const licenseComment = `/*!
Bundled license information:
${licenseText}
*/`;

const cssLicenseComment = `/*!
${cssLicenseText}
*/`;

const name = process?.env?.npm_package_name;
if (name == null || name.includes("*/")) {
  throw new Error("Name not found or invalid!");
}
const version = process?.env?.npm_package_version;
if (version == null || version.includes("*/")) {
  throw new Error("Version not found or invalid!");
}

let settings: string;
let banner: string;
let cssBanner: string;

settings = `const overrides = {
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

banner = `${settings}
/* version ${version} */`;

cssBanner = `@import url(https://fonts.googleapis.com/css?family={{fontFamily}}:700);
html {
  --padding: {{padding}}px;
  --background-color: rgba(0, 0, 0, 0);
  --font-size: {{fontSize}}px;
  --text-color: {{textColor}};
  --message-hide-delay: {{messageHideDelay}}s;
  --font-family: {{fontFamily}};
}
/* version ${version} */`;

await esbuild.build({
  tsconfig: "tsconfig.json",
  entryPoints: [
    "src/streamelements/custom.ts",
    "src/streamelements/custom.scss",
  ],
  bundle: true,
  outdir: "streamelements/",
  format: "iife",
  target: ["ES2019"],
  banner: {
    js: banner,
    css: cssBanner,
  },
  footer: {
    js: licenseComment,
    css: cssLicenseComment,
  },
  platform: "browser",
  minify: false,
  sourcemap: false,
  plugins: [
    sassPlugin(),
    copyStaticFiles({
      src: "./static/streamelements",
      dest: "./streamelements",
    }),
  ],
});

settings = `const settings = ${JSON.stringify(defaultSettings, null, 2)};
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

banner = `${settings}
/* version ${version} */`;

cssBanner = `@import url(https://fonts.googleapis.com/css?family=Roboto:700);
html {
  --padding: {padding}px;
  --background-color: {background_color};
  --font-size: {font_size};
  --text-color: {text_color};
  --message-hide-delay: {message_hide_delay};
  --font-family: "Roboto";
}
/* version ${version} */`;

await esbuild.build({
  tsconfig: "tsconfig.json",
  entryPoints: ["src/streamlabs/custom.ts", "src/streamlabs/custom.scss"],
  bundle: true,
  outdir: "streamlabs/",
  format: "iife",
  target: ["ES2019"],
  banner: {
    js: banner,
    css: cssBanner,
  },
  footer: {
    js: licenseComment,
    css: cssLicenseComment,
  },
  platform: "browser",
  minify: false,
  sourcemap: false,
  plugins: [
    sassPlugin(),
    copyStaticFiles({
      src: "./static/streamlabs",
      dest: "./streamlabs",
    }),
  ],
});
