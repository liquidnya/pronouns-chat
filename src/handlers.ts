import { Feature, FeaturesApi } from "./features";
import { ClearChat, ClearChatDetails } from "./handlers/clearchat";
import { PrivMsgHandler, PrivMsgDetails } from "./handlers/privmsg";

interface MessageDetails {
  PRIVMSG: PrivMsgDetails;
  CLEARCHAT: ClearChatDetails;
}

interface Handler {
  command: keyof MessageDetails;
  handleCommand(
    details: MessageDetails[Handler["command"]]
  ): void | Promise<void>;
}

export class Handlers {
  private features: Feature[];
  constructor(features: Feature[]) {
    this.features = features;
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
    const api: FeaturesApi = {
      forClass(className, type, action) {
        handler.addAction((elements, body) => {
          elements
            .get(className, type)
            .forEach((element) => action(element, body));
        });
      },
      forClassWithContext(className, type, action) {
        handler.addActionWithContext((elements, context) => {
          elements
            .get(className, type)
            .forEach((element) => action(element, context));
        });
      },
    };
    await Promise.all(this.features.map((feature) => feature.load(api)));
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
