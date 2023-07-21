/**
 * @template T
 * @typedef {new (...args: any[]) => T} GenericConstructor
 */

/**
 * @example <caption>Basic Usage</caption>
 * // html
 * <lightning-input
 *  data-bind="myField__c"
 *  value={myField__c}
 *  onchange={bind}
 * >Some input</lightning-input>
 * // js
 * import {useReactiveBinding} from 'c/lwcToolbox';
 * export class myLwc extends useReactiveBinding(LightningElement) {
 *  ㅤ@track myField__c // value of input will always reflect back onto the bound prop
 * }
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
      if(!_bind.includes('.'))
        this[_bind] = e.detail.value;      
      else {
        const generatedCode = _bind
        .split('.')
        .reduce((prev, _, i, arr) => prev+=`['${arr[i]}']`,'this') + ` = '${e.detail.value}'`;
        new Function(generatedCode).bind(this)();
      }
    }
  }
}