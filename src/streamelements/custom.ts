import { z } from "zod";
import { Context, Emote, Feature, FeaturesApi } from "../features";
import { nameColor } from "../features/name-color";
import { twemoji } from "../features/twemoji";
import { ffz } from "../features/ffz";
import { pronounsReplacer } from "../features/pronouns-replacer";
import { Constructor } from "../element-collection";
import { emotes } from "../features/emotes";
import hash from "hash-it";

const Boolean = z.string().transform((value) => value == "yes");

const Pronouns = z
  .enum(["yes", "no"])
  .transform((value) =>
    value == "yes" ? ["api.pronouns.alejo.io", "pronoundb.org"] : [],
  )
  .or(
    z
      .string()
      .transform((list) => list.split(",").map((value) => value.trim())),
  );

const LoadEventDetail = z
  .object({
    fieldData: z
      .object({
        showPronouns: Pronouns,
        showFrogEmotes: Boolean,
        // optional for now in case people upgrade without replacing the fields.json
        capitalizePronouns: Boolean.optional(),
        fontFamily: z.string(),
        fontSize: z.number(),
        textColor: z.string(),
        padding: z.number(),
        border: Boolean,
        messageDelay: z.number().transform((value) => value * 1000),
        hideMessage: Boolean,
        messageHideDelay: z.number().transform((value) => value * 1000),
        hideCommands: Boolean,
        mutedChatters: z.string().transform(
          (value) =>
            new Set(
              value
                .split(/(\s|,)+/)
                .map((chatter) => chatter.trim())
                .filter((chatter) => chatter != ""),
            ),
        ),
      })
      .passthrough(),
  })
  .passthrough();

const RANDOM_COLORS = [
  "#f7a6a7",
  "#f7d0a6",
  "#f7eda6",
  "#b4f7a6",
  "#a6d4f7",
  "#c8a6f7",
  "#f7a6ed",
  "#a6f7e8",
];

const EventDetail = z
  .object({
    listener: z.literal("message"),
    event: z.object({
      service: z.string(),
      data: z
        .object({
          badges: z
            .array(
              z.object({
                type: z.string(),
                version: z.string(),
                url: z.string(),
              }),
            )
            .default([]),
          displayColor: z.string().optional(),
          displayName: z.string(),
          emotes: z
            .array(z.any())
            .default([])
            .transform((array) => {
              return array
                .map((item) =>
                  z
                    .object({
                      name: z.string(),
                      type: z.string(),
                      id: z.string(),
                      urls: z.record(z.number().or(z.string()), z.string()),
                      gif: z.boolean().optional(),
                      start: z.number().nonnegative().int().optional(),
                      end: z.number().nonnegative().int().optional(),
                    })
                    .safeParse(item),
                )
                .flatMap((result) => {
                  if (result.success) {
                    return [result.data];
                  } else {
                    return [];
                  }
                });
            }),
          tags: z
            .object({
              emotes: z.string().optional(),
            })
            .passthrough(),
          msgId: z.string(),
          nick: z.string(),
          text: z.string(),
          userId: z.string(),
        })
        .passthrough()
        .transform((value) => {
          if (value.displayColor == null || value.displayColor == "") {
            const index = Math.abs(hash(value.userId)) % RANDOM_COLORS.length;
            return { ...value, displayColor: RANDOM_COLORS[index] };
          }
          return value as typeof value & { displayColor: string };
        }),
    }),
  })
  .or(
    z.object({
      listener: z.literal("delete-messages"),
      event: z
        .object({
          userId: z.string().optional(),
        })
        .passthrough(),
    }),
  )
  .or(
    z.object({
      listener: z.literal("delete-message"),
      event: z
        .object({
          msgId: z.string(),
        })
        .passthrough(),
    }),
  );

type LoadEventDetail = z.output<typeof LoadEventDetail>;
type EventDetail = z.output<typeof EventDetail>;
type MessageEvent = (z.output<typeof EventDetail> & {
  listener: "message";
})["event"];

class MessageHandler {
  private log: HTMLElement | null = null;
  private fieldData: LoadEventDetail["fieldData"] | null = null;
  private features: Feature[];
  private actions: Record<
    string,
    ((element: Node, context: Context) => void)[]
  >;
  constructor(features: Feature[]) {
    this.features = features;
    this.actions = {};
  }
  private renderMessage(event: MessageEvent) {
    // create message
    const badges = document.createElement("span");
    badges.className = "badges";
    const allBadges = event.data.badges.map((badge) => {
      const img = document.createElement("img");
      img.src = badge.url;
      img.classList.add("badge", `${badge.type}-icon`);
      return img;
    });
    badges.append(...allBadges);
    const pronouns = document.createElement("span");
    pronouns.className = "pronouns";
    const name = document.createElement("span");
    name.className = "name";
    name.dataset.color = event.data.displayColor;
    // some users have \s in their display name
    // looks like this on IRC: `display-name=DisplayName\\s;`
    // only fix rendering the display name on-screen, but keep the display name as-is
    name.append(
      document.createTextNode(event.data.displayName.replace("\\s", " ")),
    );
    const meta = document.createElement("span");
    meta.className = "meta";
    meta.append(badges, pronouns, name);
    const message = document.createElement("span");
    message.className = "message";
    message.append(document.createTextNode(event.data.text));
    const container = document.createElement("div");
    if (this.fieldData != null && !this.fieldData.hideMessage) {
      container.style.setProperty("--message-hide-delay", "99999999s");
    }
    container.dataset.userDisplayName = event.data.displayName;
    container.dataset.userName = event.data.nick;
    container.dataset.userId = event.data.userId;
    container.dataset.id = event.data.msgId;
    if (this.fieldData != null && this.fieldData.messageDelay > 0) {
      container.style.display = "none";
      setTimeout(
        () => (container.style.display = "block"),
        this.fieldData.messageDelay,
      );
    }
    container.append(meta, message);
    // run actions
    const context: Context = {
      emotes: event.data.emotes.filter(
        (emote) => emote.start != null && emote.end != null,
      ) as Emote[],
      message: event.data.text,
      user: {
        id: event.data.userId,
        name: event.data.nick,
        displayName: event.data.displayName,
      },
      render: true,
      service: event.service,
    };
    this.runAction("message", message, context);
    this.runAction("name", name, context);
    this.runAction("pronouns", pronouns, context);
    this.runAction("badge", allBadges, context);
    return container;
  }
  private handleMessage(event: MessageEvent) {
    if (this.fieldData != null) {
      if (this.fieldData.hideCommands && event.data.text.startsWith("!")) {
        return;
      }
      if (
        this.fieldData.mutedChatters.has(event.data.nick) ||
        this.fieldData.mutedChatters.has(event.data.displayName)
      ) {
        return;
      }
    }
    // console.log(event.data);
    // always add the container to the log immediately, because otherwise it might be deleted before it will be displayed
    this.log?.append(this.renderMessage(event));
  }
  private handleEvent(obj: Event) {
    if (obj instanceof CustomEvent) {
      const detail = EventDetail.safeParse(obj.detail);
      if (detail.success) {
        if (detail.data.listener === "message") {
          this.handleMessage(detail.data.event);
        } else if (detail.data.listener === "delete-messages") {
          const userId = detail.data.event.userId;
          if (userId == null) {
            // console.log(`delete all messages`);
            this.removeAllLogs();
          } else {
            // console.log(`delete message by ${userId}`);
            this.removeAllBySelector('[data-user-id="' + userId + '"]');
          }
        } else if (detail.data.listener === "delete-message") {
          // console.log(`delete message with id ${detail.data.event.msgId}`);
          this.removeAllBySelector(
            '[data-id="' + detail.data.event.msgId + '"]',
          );
        }
      } else {
        console.log(detail.error);
      }
    }
  }
  private removeAllBySelector(selector: string) {
    const nodes = document.querySelectorAll(selector);
    nodes.forEach((node) => node.remove());
  }
  private removeAllLogs() {
    if (this.log != null) {
      this.log.replaceChildren();
    }
  }
  private runAction(className: string, element: Node, context: Context): void;
  private runAction(
    className: string,
    elements: Node[],
    context: Context,
  ): void;
  private runAction(
    className: string,
    elements: Node | Node[],
    context: Context,
  ): void {
    if (className in this.actions) {
      const elementsArray = Array.isArray(elements) ? elements : [elements];
      this.actions[className].forEach((action) =>
        elementsArray.forEach((element) => action(element, context)),
      );
    }
  }
  private addAction<E>(
    className: string,
    type: Constructor<E>,
    action: (element: E, context: Context) => void,
  ) {
    if (!(className in this.actions)) {
      this.actions[className] = [];
    }
    this.actions[className].push((element, context) => {
      if (element instanceof type) {
        action(element, context);
      }
    });
  }
  async load(obj: Event) {
    if (obj instanceof CustomEvent) {
      const detail = LoadEventDetail.parse(obj.detail);
      if (!detail.fieldData.border) {
        document.body.style.filter = "none";
      }
      this.log = document.getElementById("log");
      this.fieldData = detail.fieldData;
      const api: FeaturesApi = {
        forClass: this.addAction.bind(this),
        overrides: overrides,
        settings: {
          showFrogEmotes: detail.fieldData.showFrogEmotes,
          pronouns: detail.fieldData.showPronouns,
          capitalizePronouns: detail.fieldData.capitalizePronouns ?? true,
        },
      };
      await Promise.all(this.features.map((feature) => feature.load(api)));
      window.addEventListener("onEventReceived", this.handleEvent.bind(this));
    }
  }
}

const handler = new MessageHandler([
  nameColor,
  emotes,
  twemoji,
  ffz,
  pronounsReplacer,
]);

window.addEventListener("onWidgetLoad", handler.load.bind(handler));
