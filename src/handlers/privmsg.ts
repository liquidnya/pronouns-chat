import { ElementsCollection } from "../element-collection";

export interface PrvMsgDetails {
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
}

export interface Context {
  userId: string;
  username: string;
}

export type Action = (elements: ElementsCollection) => void;
export type ActionWithContext = (
  elements: ElementsCollection,
  context: Context
) => void;

export class PrivMsgHandler {
  readonly command = "PRIVMSG" as const;
  private validUsername = /^[a-z0-9_]{2,}$/;
  private actions: Action[] = [];
  private actionsWithContext: ActionWithContext[] = [];
  addAction(action: Action) {
    this.actions.push(action);
  }
  addActionWithContext(actionWithContext: ActionWithContext) {
    this.actionsWithContext.push(actionWithContext);
  }
  private elements(entries: Element[], className: string): Element[] {
    return entries.flatMap((entry) => [
      ...entry.getElementsByClassName(className),
    ]);
  }
  private logError(message: string, detail: PrvMsgDetails) {
    console.error(
      message +
        " for message id " +
        detail.messageId +
        " and username " +
        detail.from
    );
  }
  handleCommand(detail: PrvMsgDetails) {
    let elements = new ElementsCollection(
      '[data-id="' + detail.messageId + '"]'
    );
    if (elements.length == 0) {
      elements = new ElementsCollection(
        '[data-from="' + detail.tags["display-name"] + '"]:last-child'
      );
      if (elements.length == 0) {
        this.logError("message div not found", detail);
        return;
      }
    }

    this.actions.forEach((action) => action(elements));

    const userId = detail.tags["user-id"];
    if (userId == null) {
      this.logError("unknown user id", detail);
      return;
    }

    // set user-id
    elements.forEach((entry) => (entry.dataset.userId = userId), HTMLElement);

    const username = this.extractUsername(detail);
    if (username == null) {
      this.logError("unknown username", detail);
      return;
    }

    this.actionsWithContext.forEach((action) =>
      action(elements, {
        userId,
        username,
      })
    );
  }
  private extractUsername(detail: PrvMsgDetails) {
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
