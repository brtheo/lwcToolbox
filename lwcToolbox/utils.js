import { LightningElement } from "lwc";

/**
 * Useful method to pass as an input a custom label formated as an ES6 template literal
 * like this : Hello ${name}
 * Take an object of the shape as a second parameter : {name: 'John Doe'}
 * @param {string} input
 * @param {Object} params
 * @returns {string}
 */
export function interpolate(input,params) {
  const names = Object.keys(params);
  const vals = Object.values(params);
  return new Function(...names, `return \`${input}\`;`)(...vals);
}
/**
 * Will plug your styles to an html element that has the attribute [data-style] on it
 * @param {string} styles 
 */
export function setDataStyle(styles) {
  this.template.querySelector('[data-style]').insertAdjacentHTML('beforeend',/*html*/`<style>${styles}</style>`)
}

/**
 * @callback From
 * @param {Object} obj
 * @returns {Object}
 */
/**
 * @typedef {Object} PickReturns
 * @param {From} from
 */
/**
 * @example <caption>Basic Usage</caption>
 * const foo = [
 *   {bar: "bar", baz: "baz"}, 
 *   {bar: "barbar", baz: "bazbaz"}
 * ].map(obj => pick('bar').from(obj));
 * // foo => [{bar:"bar"}, {bar:"barbar"}]
 * 
 * @param {Array<String>} fields 
 * @returns {PickReturns} - Returns a new object containing only the fields passed as arguments from another object.
 */
export function pick(...fields) {
  return {
    from: (obj) => (({...fields}) => ({...fields}))(obj)
  }
}

/**
 * @example <caption>Basic Usage</caption>
 * import {LightningElement} from 'lwc';
 * import {compose, useRecordFields, useReactiveBinding} from 'c/lwcToolbox';
 * const fields = [...];
 * const Composed = compose(
 *   [useRecordFields, fields],
 *   [useReactiveBinding],
 *   LightningElement
 * );
 * export default MyComponent extends Composed {...}
 * 
 * @param  {...any} fns - arguments array of Record<Mixin, mixinArg1, mixinArgs2>
 * @returns {import("./useSObject").GenericConstructor} 
 */
export function compose(...fns) {
  return fns.reduceRight( (comp, [mix,...arg]) => class extends mix(comp, ...arg){}, LightningElement);
}
