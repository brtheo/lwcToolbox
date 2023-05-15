/**
 * @template T
 * @typedef {new (...args: any[]) => T} GenericConstructor
 */

/**
 * @template T
 * @param {GenericConstructor<T>} genericConstructor 
 * @returns {GenericConstructor<Anonymous>}
 */
export function useReactiveBinding(genericConstructor) {
  return class Anonymous extends genericConstructor {
    /**
     * Automatically assign the changed input to the bound variable
     * @param {InputEvent} e 
     */
    bind(e) {
      const {currentTarget} = e;
      const _bind = currentTarget.dataset['bind'];
      this[_bind] = e.detail.value;      
    }
  }
}