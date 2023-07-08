import defaultSettings from "./default-settings";

export {};

declare global {
  const settings: typeof defaultSettings;
  const overrides: Record<
    "ffz" | "bttv" | "7tv" | "twitch",
    Record<string, string | null>
  >;
}
