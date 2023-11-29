import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import {  wire } from 'lwc';

/**
 * Binds together an input to a class property
 * @example <caption>Basic Usage</caption>
 * // js
 * import {useRelatedRecords} from 'c/lwcToolbox';
 * export class myLwc extends useRelatedRecords(LightningElement, 'RelatedObjects__r', ['RelatedObject__c.Field__c']) {
 *  ㅤ@api recordId;
 *    doSomething() {
 *         console.log(this.RelatedObjects__r.Field__c); // <== access the queried field
 *    }
 * }
 * @template T
 * @param {GenericConstructor<T>} genericConstructor 
 * @returns {GenericConstructor<Anonymous>}
 */
export const useRelatedRecords = (genericConstructor, {relatedListId, fields, where, sortBy, pageSize}) => {
  const FIELDS_APINAME = fields.map(field => field.split('.').toSpliced(0,1).join('.'))
  const placeholder = class extends genericConstructor {
    @wire(getRelatedListRecords, {
      parentRecordId: '$parentRecordId',
      relatedListId,
      fields,
      sortBy,
      pageSize,
      where,
    })
    __WIRED_RELATED_RESULTS__;
  }
  Object.defineProperty(placeholder.prototype, relatedListId, {
    get() {
      if(this?.__WIRED_RELATED_RESULTS__) {
        // fields = this?.__WIRED_RELATED_RESULTS__.data?.records?.at(0)?.fields;
        return this?.__WIRED_RELATED_RESULTS__.data?.records.map(record => 
          Object.fromEntries(
            FIELDS_APINAME.map(field => {
              const [related, fieldValue] = field.split('.').at(0).at(-1) === 'r' || 's'
                ? field.split('.')
                : [field, '']
              const fieldApiName = record?.[related]
              return [
                related, field.split('.').at(0).at(-1) === 'r' || 's'
                  ? Object.fromEntries([[fieldValue, fieldApiName?.value?.fields?.[fieldValue]?.value]])
                  : fieldApiName?.value
                ]
            })
          )
        )
      }    
      return undefined;
    }
  });
  return placeholder;
}
