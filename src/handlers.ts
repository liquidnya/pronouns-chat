import { Extension, ExtensionsApi } from "./extensions";
import { ClearChat, ClearChatDetails } from "./handlers/clearchat";
import { PrivMsgHandler, PrvMsgDetails } from "./handlers/privmsg";

interface MessageDetails {
  PRIVMSG: PrvMsgDetails;
  CLEARCHAT: ClearChatDetails;
}

interface Handler {
  command: keyof MessageDetails;
  handleCommand(
    details: MessageDetails[Handler["command"]]
  ): void | Promise<void>;
}

export class Handlers {
  private extensions: Extension[];
  constructor(extensions: Extension[]) {
    this.extensions = extensions;
  }
  private map: Record<string, Handler> = {};
  private eventReceived(event: Event) {
    if (event instanceof CustomEvent) {
      const handler = this.map[event.detail.command];
      if (handler != null) {
        return handler.handleCommand(event.detail);
      }
    }
  }
  private register(handler: Handler) {
    this.map[handler.command] = handler;
  }
  private async load() {
    const handler = new PrivMsgHandler();
    const api: ExtensionsApi = {
      forClass(className, type, action) {
        handler.addAction((elements) => {
          action(elements.get(className, type));
        });
      },
      forClassWithContext(className, type, action) {
        handler.addActionWithContext((elements, context) => {
          action(elements.get(className, type), context);
        });
      },
    };
    await Promise.all(this.extensions.map((extension) => extension.load(api)));
    this.register(handler);
    console.log("ready to meow!");
  }
  async run() {
    this.register(new ClearChat());
    document.addEventListener("onEventReceived", (event) =>
      this.eventReceived(event)
    );
    await this.load();
  }
}
