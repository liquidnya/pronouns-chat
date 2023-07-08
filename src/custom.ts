import { Handlers } from "./handlers";
import { nameColor } from "./features/name-color";
import { emotes } from "./features/emotes";
import { pronounsReplacer } from "./features/pronouns-replacer";
import { ffz } from "./features/ffz";
import { badges } from "./features/badges";
import { twemoji } from "./features/twemoji";

const handlers = new Handlers([
  nameColor,
  emotes,
  twemoji,
  ffz,
  badges,
  pronounsReplacer,
]);
handlers.run();
