import _untilTemplate from './untilTemplate.html';

/**
 * @template T
 * @typedef {new (...args: any[]) => T} GenericConstructor
 */


/**
 * Will render the provided template until every given properties or functions resolve data
 * @example <caption>Basic Usage</caption>
 * import {useSuspense} from 'c/lwcToolbox';
 * 
 * export class myLwc extends useSuspense(LightningElement, {
 *   props: [
 *     'aFieldThatShouldNotBeUndefinedOrThatShouldBeTrue',
 *     self => self.aSpecificCondition >= 3
 *   ],
 *   template, // template of the current component
 *   untilTemplate // this parameter can be ommitted, by default it's a spinner but can be customized
 * }) {
 * }
 * @template T
 * @param {GenericConstructor<T>} genericConstructor 
 * @param {Array<Fields>} fields 
 * @returns {GenericConstructor<Placeholder>}
 */
export function useSuspense(genericConstructor, conf) {
  let {props, template, untilTemplate} = conf;
  untilTemplate = untilTemplate === undefined ? _untilTemplate : untilTemplate
  return class extends genericConstructor {
    get _ALL_PROMISES_SETTLED_() {
      return props.reduce((acc,curr) => acc && (
        typeof curr === 'function' 
          ? curr(this)
          : this[curr] !== undefined || this[curr]
        )
      , true)
    }
    render() {
      return this._ALL_PROMISES_SETTLED_ ? template : untilTemplate
    }
  }
}
