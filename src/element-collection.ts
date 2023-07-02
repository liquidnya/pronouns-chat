export type Constructor<T> = new (...args: unknown[]) => T;

export class ElementsCollection {
  private elements: Element[];
  constructor(selectors: string) {
    this.elements = [...document.querySelectorAll(selectors)];
  }
  get length() {
    return this.elements.length;
  }
  forEach(action: (element: Element) => void): void;
  forEach<E extends Element>(
    action: (element: E) => void,
    type: Constructor<E>
  ): void;
  forEach<E extends Element>(
    action: (element: E | Element) => void,
    type?: Constructor<E>
  ): void {
    this.elements.forEach((element) => {
      if (type == null || element instanceof type) {
        action(element);
      }
    });
  }
  get(className: string): Element[];
  get<E extends Element>(className: string, type: Constructor<E>): E[];
  get<E extends Element>(
    className: string,
    type?: Constructor<E>
  ): E[] | Element[] {
    const elements = this.elements.flatMap((element) => [
      ...element.getElementsByClassName(className),
    ]);
    if (type == null) {
      return elements;
    }
    return <E[]>elements.filter((element) => element instanceof type);
  }
}
