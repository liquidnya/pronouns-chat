import { ElementsCollection } from "../../element-collection";
import { Context, parseTwitchEmotes } from "../../features";

export interface PrivMsgDetails {
  command: "PRIVMSG";
  messageId: string;
  from: string;
  payload: {
    command: "PRIVMSG";
    crlf: string;
    params: string[];
    prefix: string;
    raw: string;
    tags: Record<string, string>;
  };
  tags: Record<string, string>;
  body: string;
  platform: string;
}

export type Action = (elements: ElementsCollection, context: Context) => void;

export class PrivMsgHandler {
  readonly command = "PRIVMSG" as const;
  private validUsername = /^[a-z0-9_]{2,}$/;
  private actions: Action[] = [];
  addAction(action: Action) {
    this.actions.push(action);
  }
  private elements(entries: Element[], className: string): Element[] {
    return entries.flatMap((entry) => [
      ...entry.getElementsByClassName(className),
    ]);
  }
  private logError(message: string, detail: PrivMsgDetails) {
    console.error(
      message +
        " for message id " +
        detail.messageId +
        " and username " +
        detail.from,
    );
  }
  handleCommand(detail: PrivMsgDetails) {
    let elements = new ElementsCollection(
      '[data-id="' + detail.messageId + '"]',
    );
    if (elements.length == 0) {
      elements = new ElementsCollection(
        '[data-from="' + detail.tags["display-name"] + '"]:last-child',
      );
      if (elements.length == 0) {
        this.logError("message div not found", detail);
        return;
      }
    }

    let userId: string | undefined = undefined;
    if ("user-id" in detail.tags) {
      userId = detail.tags["user-id"];
    }
    if (userId == null) {
      this.logError("unknown user id", detail);
    }

    // set user-id
    if (userId != null) {
      elements.forEach((entry) => (entry.dataset.userId = userId), HTMLElement);
    }

    const username = this.extractUsername(detail);
    if (username == null) {
      this.logError("unknown username", detail);
    }
    const context = {
      message: detail.body,
      user: {
        id: userId,
        name: username ?? undefined,
        displayName: detail.tags["display-name"],
      },
      get emotes() {
        if ("emotes" in detail.tags) {
          return parseTwitchEmotes(detail.tags["emotes"]);
        } else {
          return [];
        }
      },
      // for some reason when the message contains both `<` and `>` the message will be escaped twice
      // so in that case there is a best-effort fix to replace everything with the original message
      // since that is less disrupting for now
      render: detail.body.includes("<") && detail.body.includes(">"),
      service: detail.platform,
    };
    this.actions.forEach((action) => action(elements, context));
  }
  private extractUsername(detail: PrivMsgDetails) {
    if (detail.from.match(this.validUsername)) {
      return detail.from;
    }
    let username = detail.payload.prefix;
    let idx = username.indexOf("!");
    if (idx != -1) {
      username = username.substring(0, idx);
      if (username.match(this.validUsername)) {
        return username;
      }
      username = username.substring(idx + 1);
    }
    idx = username.indexOf("@");
    if (idx != -1) {
      username = username.substring(0, idx);
    }
    if (!username.match(this.validUsername)) {
      return null;
    }
    return username;
  }
}
