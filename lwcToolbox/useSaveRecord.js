import { updateRecord, createRecord} from 'lightning/uiRecordApi';

/**
 * @template T
 * @typedef {new (...args: any[]) => T} GenericConstructor
 */
/**
 * Gives access to the `saveRecord` method  in the component context.
 * 
 * @example <caption>Basic Usage</caption>
 * // lwc.js
 * import {useSObject, useReactiveBinding, useSaveRecord, compose} from 'c/lwcToolbox';
 * import fields from './anyObject__c.fields.js';
 * const Composed = compose(
 *   [useSObject, fields],
 *   [useReactiveBinding],
 *   [useSaveRecord],
 *   LightningElement
 * );
 * export default class lwc extends Composed {
 *   handleSave() {
 *     this.saveRecord(this.AnyObject__ref);
 *   }
 * }
 * @template T
 * @param {GenericConstructor<T>} genericConstructor 
 * @returns {GenericConstructor<Anonymous>}
 */
export function useSaveRecord(genericConstructor) {
  return class extends genericConstructor {
    /**
     * @param {SObjectRecord} record 
     * @param {string} [apiName] 
     * @returns {SObjectRecord}
     */
    async saveRecord(record, apiName = this['__SOBJECT_MXN_SOBJECT_REF_API_NAME__']) {
      return record.Id
        ? await updateRecord( {fields: record} )
        : await createRecord( {apiName, fields: record} )
    }
  }
}