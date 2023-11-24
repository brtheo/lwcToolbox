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
export const useRelatedRecords = (genericConstructor, {relatedListId, fields}) => {
  const FIELDS_APINAME = fields.map(field => field.split('.').toSpliced(0,1).join('.'))
  const placeholder = class extends genericConstructor {
    @wire(getRelatedListRecords, {
      parentRecordId: '$parentRecordId',
      relatedListId: relatedListId,
      fields: fields
    })
    __WIRED_RELATED_RESULTS__;
  }
  Object.defineProperty(placeholder.prototype, relatedListId, {
    get() {
      let fields;
      if(this?.__WIRED_RELATED_RESULTS__) {
        fields = this?.__WIRED_RELATED_RESULTS__.data?.records?.at(0)?.fields
        return Object.fromEntries(
          FIELDS_APINAME.map(field => {
            const [related, fieldValue] = field.split('.').at(0).at(-1) === 'r'
              ? field.split('.')
              : [field, '']
            const fieldApiName = fields?.[related]
            return [
              related, field.split('.').at(0).at(-1) === 'r'
                ? Object.fromEntries([[fieldValue, fieldApiName?.value?.fields?.[fieldValue]?.value]])
                : fieldApiName?.value
              ]
          })
        )
      }    
      return undefined;
    }
  });
  return placeholder;
}
