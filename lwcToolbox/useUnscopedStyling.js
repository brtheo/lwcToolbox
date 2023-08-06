import { setDataStyle } from "./utils";


/**
 * Will plug an external stylesheet to an element that has an attribute [data-style]
 * @example <caption>Basic usage</caption>
 * // lwc.html
 * <div data-style></div>
 * ...rest of my component
 * // lwc.js
 * import {useUnscopedStyling} from 'c/lwcToolbox';
 * const styles = `
 *   .toastMessage.forceActionsText{
 *     white-space : pre-line !important;
 *   }
 * `;
 * export default class lwc extends useUnscopedStyling(LightningElement, styles) {...}
 * @param {GenericConstructor} genericConstructor 
 * @param {string} styles
 */
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