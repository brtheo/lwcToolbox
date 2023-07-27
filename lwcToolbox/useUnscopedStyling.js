import { setDataStyle } from "./utils";

export function useUnscopedStyling(genericConstructor, styles) {
  return class extends genericConstructor {
    #__isInit__ = false;
    renderedCallback() {
      if(!this.#__isInit__) {
        setDataStyle.call(this, styles);
        this.#__isInit__ = true;
      }
    }
  }
}