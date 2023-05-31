const SELF_IDENTIFIER = '$';

/**
 * @typedef {Object.<string, any>} SObject
 */

/**
 * @typedef {Object} Combobox
 * @prop {string | Array<string>} value Value of the combobox option
 * @prop {string | Array<string>} label - Label of the combobox option
 * @prop {string | Array<string>} [description] - Description is Optional
 */

/**
 * @param {Array<SObject>} input 
 * @param {Combobox} param 
 * @returns {Array<Combobox>}
 */
export function comboboxify (input, {value, label, description}) {
    /**
   * @param {string} path
   * @param {SObject} obj
   * @returns {string}
   */
  const getValueFromStringPath = (path, obj) => path.split('.').reduce((accObj, curr) => accObj[curr], obj);

  /**
   * @param {Array<string>} input 
   * @param {SObject | string} value
   * @returns {string}
   */
  const templater = (input, value) => input.map(str => str === SELF_IDENTIFIER 
    ? value 
    : getValueFromStringPath(str, value)
  ).join(' ');

  /**
   * @param {string | Array<string>} key 
   * @param {SObject} sobject 
   * @returns {string}
   */
  const getValueForKey = (key, sobject) => key === SELF_IDENTIFIER ? sobject : templater(key,sobject);

  /**
   * @param {SObject} val 
   * @returns {Combobox}
   */
  const mappedObject = val => Object.create({
    label: getValueForKey(label, val),
    value: getValueForKey(value, val)
  });
  return input.map(val => description !== undefined 
    ? Object.assign(mappedObject(val), {description: getValueForKey(description, val)} ) 
    : mappedObject(val))
  }