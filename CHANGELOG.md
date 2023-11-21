# 3.0.0

## Other changes

- Update dependencies.
- Change parsing of emotes for StreamElements custom widget to make it more robust to any future changes.

# 3.0.0-rc.3

## Other changes

- Update documentation.

# 3.0.0-rc.2

## Bug Fixes

- Picks a random color for someone who does not have a name color set in the StreamElements custom widget.

# 3.0.0-rc.1

## Features

- Add implementation for a StreamElements custom widget.

## Other changes

- Move `dist` to `streamlabs` and restructure source code.

# 2.1.2

## Other changes

- Update documentation.

# 2.1.1

## Bug Fixes

- Mitigate a bug in Streamlabs Chat Box where the message is HTML encoded whenever `<` and `>` are contained within the message and emotes where placed incorrectly.
  Note that the mitigation will make the message readable again and place twitch emotes correctly, however ffz, bttv and 7tv emotes are not displayed.

# 2.1.0

## Features

- Emoji are now also affected by ffz modifiers.
- Add a new setting `showFrogEmotes` which if set to `false` will hide known global frog emotes from bttv and 7tv.
  Settings are set in the global variable `settings`.
- Add emote `overrides`.
  With the global variable `overrides` you can define emote replacement or removal.  
  The variable `overrides` is a map which maps from: `ffz`, `bttv`, and `7tv`.
  The value of the map is another map which maps from emote id to another emote id or null for removal.  
  For example:
  ```js
  const overrides = {
    ffz: {},
    bttv: {
      "56e9f494fff3cc5c35e5287e": "5f6bcffcc2f3a70b1ae5342f",
    },
    "7tv": {
      "60e5d610a69fc8d27f2737b7": null,
    },
  };
  ```
  This would replace the bttv emote `56e9f494fff3cc5c35e5287e` (monkaS) with `5f6bcffcc2f3a70b1ae5342f` (monkaS) and remove the 7tv emote `60e5d610a69fc8d27f2737b7` (Stare).  
  Emotes that are removed are replaced with their text.

## Bug fixes

- Fixed alignment issues for emotes that are modified by ffz modifiers.

# 2.0.1

## Other changes

- Update documentation.

# 2.0.0

Initial version.
