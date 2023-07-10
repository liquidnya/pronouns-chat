import { Constructor } from "./element-collection";

export interface TwitchEmote {
  readonly id: string;
  readonly start: number;
  readonly end: number;
}

export interface User {
  id: string,
  name: string,
  displayName: string,
}

export type Overrides = Record<
  "ffz" | "bttv" | "7tv" | "twitch",
  Record<string, string | null>
>;

export interface Context {
  parseTwitchEmotes(): TwitchEmote[];
  readonly message: string,
  readonly user: Partial<User>,
}

export interface FeaturesApi {
  forClass<E extends Element>(
    className: string,
    type: Constructor<E>,
    action: (element: E, context: Context) => void
  ): void;
  settings: {
    showPronouns: boolean,
    showFrogEmotes: boolean,
  };
  overrides: Overrides,
}

export interface Feature {
  load(api: FeaturesApi): Promise<void>;
}

export function parseTwitchEmotes(
  emotesTag: string
): TwitchEmote[] {
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
      return [{ id, start, end }];
    })
    .sort((a, b) => a.start - b.start);
}
