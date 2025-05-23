# 6.0.0

## Other changes

- Update dependencies.
- Removed the `const pronounsApis = ["pronoundb.org", "api.pronouns.alejo.io"];` option and removed the `showPronouns` setting from Streamlabs.
- Instead the pronouns API preference can be set

  - using the UI of the StreamElements version (click on the chat widget and then open `Settings` on the left and change the `Show Pronouns (order of preference)` setting).
  - or by changing the `"pronouns"` setting in the `JS` code of Streamlabs. See the [README.md](./README.md#streamlabs) for details.

# 5.0.0

## Features

- Add support for pronouns from <https://pronoundb.org/>.
  However, if a user has pronouns set on <https://pr.alejo.io/> those will take priority.

  To change this behaviour or to use only one of those services you can adjust the following code in the JS:

  ```js
  const pronounsApis = ["pronoundb.org", "api.pronouns.alejo.io"];
  ```

  E.g. to change the priority set this to `const pronounsApis = ["api.pronouns.alejo.io","pronoundb.org"];` or to only use <https://pr.alejo.io/> set this to `const pronounsApis = ["api.pronouns.alejo.io"];`.

- Add a new setting `capitalizePronouns` which if set to `true` will capitalize pronouns, otherwise pronouns will be in all lowercase.
  Settings are set in the global variable `settings` for Streamlabs.

# 4.1.0

## Other changes

- Update all dependencies.

# 4.0.1

## Bug Fixes

- No longer displays `\s` in the display name of chatters who have spaces in their display name.

## Other changes

- Update documentation.

# 4.0.0

## Features

- Update from `@twemoji/api` to the newest version of `@discordapp/twemoji` which supports new emoji from Unicode `15.0`.

## Other changes

- Update `Node.js` to the minimum version `22.3.0` and using `22.6.0` to build the project.
- Update all dependencies.

# 3.1.1

## Other changes

- Update documentation.

# 3.1.0

## Features

- Use new pronouns API adding support for mixed pronouns.

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
