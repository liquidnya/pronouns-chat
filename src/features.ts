import { Constructor } from "./element-collection";
import { Context } from "./handlers/privmsg";

export interface FeaturesApi {
  forClass<E extends Element>(
    className: string,
    type: Constructor<E>,
    action: (element: E) => void
  ): void;
  forClassWithContext<E extends Element>(
    className: string,
    type: Constructor<E>,
    action: (element: E, context: Context) => void
  ): void;
}

export interface Feature {
  load(api: FeaturesApi): Promise<void>;
}
