import { Constructor } from "./element-collection";
import { Context } from "./handlers/privmsg";

export interface ExtensionsApi {
  forClass<E extends Element>(
    className: string,
    type: Constructor<E>,
    action: (entries: E[]) => void
  ): void;
  forClassWithContext<E extends Element>(
    className: string,
    type: Constructor<E>,
    action: (entries: E[], context: Context) => void
  ): void;
}

export interface Extension {
  load(api: ExtensionsApi): Promise<void>;
}
