export interface ClearChatDetails {
  command: "CLEARCHAT";
  body: string;
  tags: Record<string, string>;
}

export class ClearChat {
  command = "CLEARCHAT" as const;
  handleCommand(detail: ClearChatDetails) {
    const userId = detail.tags["target-user-id"];
    const username = detail.body;
    if (userId == null && username == null) {
      this.removeAllLogs();
    }
    if (userId != null) {
      this.removeAllBySelector('[data-user-id="' + userId + '"]');
    }
    if (username != null) {
      this.removeAllBySelector('[data-from="' + username + '" i]');
    }
  }
  private removeAllBySelector(selector: string) {
    const nodes = document.querySelectorAll(selector);
    nodes.forEach((node) => node.remove());
  }
  private removeAllLogs() {
    const elem = document.getElementById("log");
    if (elem != null) {
      elem.replaceChildren();
    }
  }
}
