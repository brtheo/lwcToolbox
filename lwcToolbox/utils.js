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
 * @param {Array<String>} fields 
 * @returns {PickReturns}
 */
export function pick(...fields) {
  return {
    from: (obj) => (({...fields}) => ({...fields}))(obj)
  }
}