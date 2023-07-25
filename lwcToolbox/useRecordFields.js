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
 * @example <caption>Basic Usage</caption>
 * import {useRecordFields} from 'c/lwcToolbox';
 * 
 * import AnnualRevenue from '@salesforce/schema/Account.AnnualRevenue'; 
 * import CreatedDate from '@salesforce/schema/Account.CreatedDate';
 * import SLAExpirationDate__c from '@salesforce/schema/Account.SLAExpirationDate__c';
 * 
 * const fields = [AnnualRevenue, CreatedDate, SLAExpirationDate__c];
 * 
 * export class myLwc extends useRecordFields(LightningElement, fields) {
 *  ㅤ@api recordId;
 *    
 *    doSomething() {
 *       console.log(this.Account.AnnualRevenue, this.Account.SLAExpirationDate__c);
 *    }
 * }
 * @template T
 * @param {GenericConstructor<T>} genericConstructor 
 * @param {Array<Fields>} fields 
 * @returns {GenericConstructor<Placeholder>}
 */
export function useRecordFields(genericConstructor, fields) {
  const {objectApiName} = fields[0];
  const placeholder = class extends genericConstructor {
    @wire(getRecord, {recordId: '$recordId', fields: fields})
    _fields;
    @track __fields__;
    __isInit__ = false;

  }

  Object.defineProperty(placeholder.prototype, objectApiName, {
    get() {
      return !this.__isInit__ ? deepenedObject(Object.fromEntries(fields.map((field) => {
        return [field.fieldApiName, getFieldValue(this._fields.data, field)];
      }))) : this.__fields__
    },
    set(value) {
      this.__isInit__ = true;
      this.__fields__ = value;
    }
  });
  return placeholder;
}
