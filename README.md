# pronouns-chat

Custom HTML/CSS for Streamlabs Chat Box.

## Features

- Replaces emoji with [jdecked/twemoji](https://github.com/jdecked/twemoji).
- Adds pronouns next to the names of users if they have them setup through <https://pronouns.alejo.io/>.
- Changes the badges and emotes to use the best quality.
- Makes name colors readable.
- Adds support for emote effects by FFZ.
- Clears chat messages appropriatly whenever someone is timed out, banned or if their message is deleted and also clears the whole chat when the `/clear` command is used.

## How do I use this?

1. Go to your `Streamlabs Dashboard` then to `All Widgets` and then to the [`Chat Box`](https://streamlabs.com/dashboard#/chatbox).
2. Set `Enable Custom HTML/CSS` to `Enabled`.
3. Click on the `HTML` tab and put the contents of the file [`dist/custom.html`](dist/custom.html) into the textbox overriding what was in there before.
4. Click on the `CSS` tab and put the contents of the file [`dist/custom.css`](dist/custom.css) into the textbox overriding what was in there before.
5. Click on the `JS` tab and put the contents of the file [`dist/custom.js`](dist/custom.js) into the textbox overriding what was in there before.
6. Press the `Save Settings` button at the end of the page.

**Customizations:**

To adjust the padding on the left side of messages with more than one line do the following:

1. Go to your `Streamlabs Dashboard` then to `All Widgets` and then to the [`Chat Box`](https://streamlabs.com/dashboard#/chatbox).
2. Click on the `Add Custom Fields` button on the bottom right corner.
3. Click on the `Edit Custom Fields` button on the bottom right corner.
4. Replace the contents of the textbox with the contents of the file [`dist/custom.json`](dist/custom.json).
5. Press the `Update` button on the bottom right corner.
6. Adjust the padding by using the slider and save the settings.

To use all features except displaying the pronouns of users do the following:

1. Go to your `Streamlabs Dashboard` then to `All Widgets` and then to the [`Chat Box`](https://streamlabs.com/dashboard#/chatbox).
2. Click on the `JS` tab.
3. Replace `"showPronouns": true` with `"showPronouns": false` and save the settings.

## LICENSE

The following files have their license information within the file itself:

- `src/extensions/ffz.ts`
- `src/extensions/ffz.css`
- `dist/custom.css`
- `dist/custom.js`

All other fies are distributed under the MIT license.

See [COPYING](COPYING) for details.

## Disclaimer

This project is not affiliated with or endorsed by Streamlabs, jdecked/twemoji, pronouns.alejo.io, nor FrankerFaceZ.
