/**
 * @template T
 * @typedef {new (...args: any[]) => T} GenericConstructor
 */

/**
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