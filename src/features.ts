import { Constructor } from "./element-collection";

export interface Emote {
  name?: string;
  type: string;
  id: string;
  urls: Record<number | string, string>;
  gif?: boolean;
  start: number;
  end: number;
}

export interface User {
  id: string;
  name: string;
  displayName: string;
}

export type Overrides = Record<
  "ffz" | "bttv" | "7tv" | "twitch",
  Record<string, string | null>
>;

export interface Context {
  readonly emotes: Emote[];
  readonly message: string;
  readonly user: Partial<User>;
  readonly render: boolean;
  readonly service: string;
}

export interface FeaturesApi {
  forClass<E extends Element>(
    className: string,
    type: Constructor<E>,
    action: (element: E, context: Context) => void
  ): void;
  settings: {
    showPronouns: boolean;
    showFrogEmotes: boolean;
  };
  overrides: Overrides;
}

export interface Feature {
  load(api: FeaturesApi): Promise<void>;
}

export function parseTwitchEmotes(emotesTag: string): Emote[] {
  return emotesTag
    .split(/(,|\/)/)
    .flatMap((definition) => {
      const match =
        /^(?<emoteID>.*):(?<startPosition>[0-9]+)-(?<endPosition>[0-9]+)$/.exec(
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
      const emote: Emote & { start: number; end: number } = {
        start,
        end,
        id,
        type: "twitch",
        urls: {
          1: `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/1.0`,
          2: `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/2.0`,
          4: `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/3.0`,
        },
      };
      return [emote];
    })
    .sort((a, b) => a.start - b.start);
}
