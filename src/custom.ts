import { Handlers } from "./handlers";
import { nameColor } from "./features/name-color";
import { pronounsReplacer } from "./features/pronouns-replacer";
import { ffz } from "./features/ffz";
import { imageQuality } from "./features/image-quality";
import { twemoji } from "./features/twemoji";

const handlers = new Handlers([
  nameColor,
  twemoji,
  ffz,
  imageQuality,
  pronounsReplacer,
]);
handlers.run();
