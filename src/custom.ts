import { Handlers } from "./handlers";
import { nameColor } from "./extensions/name-color";
import { pronounsReplacer } from "./extensions/pronouns-replacer";
import { ffz } from "./extensions/ffz";
import { imageQuality } from "./extensions/image-quality";
import { twemoji } from "./extensions/twemoji";

const handlers = new Handlers([
  nameColor,
  twemoji,
  ffz,
  imageQuality,
  pronounsReplacer,
]);
handlers.run();
