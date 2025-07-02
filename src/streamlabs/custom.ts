import { Handlers } from "./handlers";
import { nameColor } from "../features/name-color";
import { emotes } from "../features/emotes";
import { pronounsReplacer } from "../features/pronouns-replacer";
import { ffz } from "../features/ffz";
import { badges } from "../features/badges";
import { twemoji } from "../features/twemoji";
import { fixDisplayName } from "./fix-display-name";
import "./custom.scss";

const handlers = new Handlers([
  fixDisplayName,
  nameColor,
  emotes,
  twemoji,
  ffz,
  badges,
  pronounsReplacer,
]);
handlers.run();
