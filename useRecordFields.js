import {wire, track} from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { trace } from './utils';
const MXN_NAME = 'useRecordFields';
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
 * Gives access to `<AnyObject>__c` property.
 * It's a map of the fields api name to their values. Can be edited and saved by passing the object to the `saveRecord` method provided by the mixin `useDML`
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
    __WIRED_RESULTS__;
    __IS_REC_FIELD_INIT__ = false;
    __REC_FIELD_MXN_SOBJECT_API_NAME__ = objectApiName;
    @track __SOBJECT_GETTER__;
    
  }
  Object.defineProperty(placeholder.prototype, objectApiName, {
    get() {
      if(this?.__WIRED_RESULTS__?.error) 
        trace(MXN_NAME, this.__WIRED_RESULTS__.error)
      else return !this.__IS_REC_FIELD_INIT__ 
        ? Object.assign(
          {'Id': this?.__WIRED_RESULTS__?.data?.id}, 
          deepenedObject(
            Object.fromEntries(
              fields.map(
                field => [field.fieldApiName, getFieldValue(this.__WIRED_RESULTS__.data, field)]
            )
           )
          )
        )
        : this.__SOBJECT_GETTER__;
    },
    set(value) {
      this.__IS_REC_FIELD_INIT__ = true;
      this.__SOBJECT_GETTER__ = value;
    }
  });
  return placeholder;
}
