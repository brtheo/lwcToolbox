import {wire} from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

/**
 * @template T
 * @typedef {new (...args: any[]) => T} GenericConstructor
 */

/**
 * @typedef {Object} Field
 * @prop {string} fieldApiName
 * @prop {string} objectApiName
 */

/**
 * @template T
 * @param {GenericConstructor<T>} genericConstructor 
 * @param {Array<Fields>} fields 
 * @returns {GenericConstructor<Placeholder>}
 */
export function useRecordFields(genericConstructor, fields) {
  const {objectApiName} = fields[0];

  class placeholder extends genericConstructor {
    @wire(getRecord, {recordId: '$recordId', fields: fields})
    _fields;
  }

  Object.defineProperty(placeholder.prototype, objectApiName, {
      get() {
        return Object.fromEntries(fields.map((field) => {
          return [field.fieldApiName, getFieldValue(this._fields.data, field)];
        }))
      }
  });

  return returnableClass;
}