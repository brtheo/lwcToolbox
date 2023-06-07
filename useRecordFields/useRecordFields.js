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