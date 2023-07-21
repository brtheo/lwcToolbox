import {wire} from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

/**
 * @template T
 * @typedef {new (...args: any[]) => T} GenericConstructor
 */
// @param {{new(...args: any[]): object}}
/**
 * @typedef {Object} Field
 * @prop {string} fieldApiName
 * @prop {string} objectApiName
 */


/**
 * 
 * @param {Object} obj 
 * @returns {Object}
 */
function deepenedObject(obj) {
  let ret = {}
  Object.entries(obj).forEach(([k,v]) => {
    const _obj = k.split('.').reduceRight((prev,curr) => Object.fromEntries([[curr,prev]]),v)
    const key = Object.keys(_obj)[0]
    const duplicateKey = Object.keys(ret).includes(key)
    if(duplicateKey) ret[key] = {...ret[key], ..._obj[key]}
    else ret = {...ret,..._obj}
  })
  return ret
}


/**
 * @template T
 * @param {GenericConstructor<T>} genericConstructor 
 * @param {Array<Fields>} fields 
 * @returns {GenericConstructor<Placeholder>}
 */
export function useRecordFields(genericConstructor, fields) {
  const {objectApiName} = fields[0];
  console.log(objectApiName, 'lwcToolbox - useRecordFields - objectApiName')
  const placeholder = class extends genericConstructor {
    @wire(getRecord, {recordId: '$recordId', fields: fields})
    _fields;
  }

  Object.defineProperty(placeholder.prototype, objectApiName, {
    get() {
      return deepenedObject(Object.fromEntries(fields.map((field) => {
        console.log(field.fieldApiName, 'lwcToolbox - useRecordFields - fieldApiName', getFieldValue(this._fields.data, field))
        return [field.fieldApiName, getFieldValue(this._fields.data, field)];
      })))
    }
  });

  return placeholder;
}
