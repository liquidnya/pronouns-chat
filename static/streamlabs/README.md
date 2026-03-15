# Streamlabs

1. Go to your `Streamlabs Dashboard` then to `All Widgets` and then to the [`Chat Box`](https://streamlabs.com/dashboard#/chatbox).
2. Set `Enable Custom HTML/CSS` to `Enabled`.
3. Click on the `HTML` tab and put the contents of the file [`streamlabs/custom.html`](./custom.html) into the textbox overriding what was in there before.
4. Click on the `CSS` tab and put the contents of the file [`streamlabs/custom.css`](./custom.css) into the textbox overriding what was in there before.
5. Click on the `JS` tab and put the contents of the file [`streamlabs/custom.js`](./custom.js) into the textbox overriding what was in there before.
6. Press the `Save Settings` button at the end of the page.

**Streamlabs Customizations:**

To adjust the padding on the left side of messages with more than one line do the following:

1. Go to your `Streamlabs Dashboard` then to `All Widgets` and then to the [`Chat Box`](https://streamlabs.com/dashboard#/chatbox).
2. Click on the `Add Custom Fields` button on the bottom right corner.
3. Click on the `Edit Custom Fields` button on the bottom right corner.
4. Replace the contents of the textbox with the contents of the file [`streamlabs/custom.json`](./custom.json).
5. Press the `Update` button on the bottom right corner.
6. Adjust the padding by using the slider and save the settings.

To hide known global frog emotes from bttv and 7tv do the following:

1. Go to your `Streamlabs Dashboard` then to `All Widgets` and then to the [`Chat Box`](https://streamlabs.com/dashboard#/chatbox).
2. Click on the `JS` tab.
3. Replace `"showFrogEmotes": true` with `"showFrogEmotes": false` and save the settings.

To show pronouns in all lowercase do the following:

1. Go to your `Streamlabs Dashboard` then to `All Widgets` and then to the [`Chat Box`](https://streamlabs.com/dashboard#/chatbox).
2. Click on the `JS` tab.
3. Replace `"capitalizePronouns": true` with `"capitalizePronouns": false` and save the settings.

To use all features except displaying the pronouns of users do the following:

1. Go to your `Streamlabs Dashboard` then to `All Widgets` and then to the [`Chat Box`](https://streamlabs.com/dashboard#/chatbox).
2. Click on the `JS` tab.
3. Delete the line containing `"api.pronouns.alejo.io",` and the line containing `"pronoundb.org"`.
4. The resulting code should look like this:
   ```
     "pronouns": [
     ],
   ```
5. Save the settings.

To change the preference of which pronouns API to use you may also change the order of `"api.pronouns.alejo.io"` with `"pronoundb.org"` or remove only one of those entries. Just make sure that the colon (`,`) is next to the first element in the list.

There is a feature to replace or hide emotes as well, for details see the [CHANGELOG.md](../CHANGELOG.md).
