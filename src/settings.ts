export {};

import defaultSettings from "./default-settings";

declare global {
  const settings: typeof defaultSettings;
}
