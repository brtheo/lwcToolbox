import {wire} from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
/** @typedef {import('../types/Quote__c').Quote__c} Quote__c*/


const placeholderClass = (genericConstructor, {fields}) => {
  const {objectApiName} = fields[0]
  class placeholder extends genericConstructor {
    @wire(getRecord, {recordId: '$recordId', fields: fields})
    _fields
  }
  Object.defineProperty(placeholder.prototype, objectApiName, {
      get() {
        return Object.fromEntries(fields.map((field) => {
          return [field.fieldApiName, getFieldValue(this._fields.data, field)]
        }))
      }
  });
  
  return [objectApiName, placeholder];
}

export function useRecordFields(genericConstructor, {recordId, fields}) {
    const returnableClass = placeholderClass(genericConstructor, {recordId, fields})[1];

    // const m = recordFields.map(recordField => placeholderClass(genericConstructor, recordField))
    // console.log('map class',m)
    // for(const [SObject, _class] of m) {
    //   Object.defineProperty(returnableClass.prototype, SObject, {
    //     get() {
    //       return _class.prototype[SObject]
    //   }})
    // }
    console.log('return', returnableClass)
    return returnableClass;
}