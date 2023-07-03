#!/usr/bin/env -S node --loader @swc-node/register/esm
import * as esbuild from "esbuild";
import defaultSettings from "../src/default-settings";
import { execSync } from "child_process";
import { readFileSync } from "fs";
import { sassPlugin } from "esbuild-sass-plugin";
import copyStaticFiles from "esbuild-copy-static-files";

const licenses = JSON.parse(
  execSync("npx license-checker --production --json").toString("utf-8")
);

const licenseText = Object.entries(licenses)
  .map(([library, info]) => {
    let repository = "";
    let license = "";
    let published = "Licensed";
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
        published =
          "Published by " + String(info["publisher"]) + " and licensed";
      }
    }
    return `- ${library}:\n${published} under ${info?.["licenses"]}.\n${repository}\n${license}`;
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

const settings = `const settings = ${JSON.stringify(
  defaultSettings,
  null,
  2
)};`;
const version = process?.env?.npm_package_version;
if (version == null || version.includes("*/")) {
  throw new Error("Version not found or invalid!");
}
const banner = `${settings}
/* version ${version} */`;

const cssBanner = `@import url(https://fonts.googleapis.com/css?family=Roboto:700);
html {
  --padding: {padding}px;
  --background-color: {background_color};
  --font-size: {font_size};
  --text-color: {text_color};
  --message-hide-delay: {message_hide_delay};
}
/* version ${version} */`;

await esbuild.build({
  tsconfig: "tsconfig.json",
  entryPoints: ["src/custom.ts", "src/custom.scss"],
  bundle: true,
  outdir: "dist/",
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
  minify: true,
  sourcemap: false,
  plugins: [
    sassPlugin(),
    copyStaticFiles({
      src: "./static",
      dest: "./dist",
    }),
  ],
});
