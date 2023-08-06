/**
 * @template T
 * @typedef {new (...args: any[]) => T} GenericConstructor
 */

/**
 * Gives access to the class property isFormValid, 
 * returning either true or false and, if false, shows the field validation errors
 * @example <caption>Basic Usage</caption>
 * // html
 * <lightning-input data-checkable>some input</lightning-input>
 * <lightning-input data-checkable>some other input</lightning-input>
 * <lightning-button onclick={handleValidateForm}></lightning-button>
 * // js
 * import {useFormValidation} from 'c/lwcToolbox';
 * export class myLwc extends useDialog(LightningElement) {
 *  handleValidateForm() {
 *    if(this.isFormValid) //doSomething()
 *  }
 * }
 * @template T
 * @param {GenericConstructor<T>} genericConstructor 
 * @returns {GenericConstructor<Anonymous>}
 */
export function useFormValidation(genericConstructor) {
  return class Anonymous extends genericConstructor {
    /**
     * checks all inputs marked as `[data-checkable]` in the template
     * @returns {boolean}
     */
    get isFormValid() {
      return [...this.template.querySelectorAll('[data-checkable]')]
      .reduce((acc,$input) => 
        acc && $input.reportValidity(), 
        true
      );
    }
  }
}