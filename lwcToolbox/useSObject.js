import { getObjectInfo, getPicklistValuesByRecordType } from "lightning/uiObjectInfoApi";
import { wire, track } from 'lwc';
import { pick } from "./utils";

/**
 * @template T
 * @typedef {new (...args: any[]) => T} GenericConstructor
 */
/**
 * @example <caption>Basic Usage</caption>
 * // lwc.js
 * import {useSObject, useReactiveBinding, compose} from 'c/lwcToolbox';
 * import fields from './anyObject__c.fields.js';
 * const Composed = compose(
 *   [useSObject, fields],
 *   [useReactiveBinding],
 *   LightningElement
 * );
 * export default class lwc extends Composed {...}
 * // lwc.html
 * <lightning-combobox
 *   data-bind="AnyObject__ref.anyField__c"
 *   value={AnyObject__ref.anyField__c}
 *   label={AnyObject__info.anyField__c.label}
 *   options={AnyObject__info.anyField__c.values}
 *   onchange={bind} >
 * </lightning-combobox>
 * @template T
 * @param {GenericConstructor<T>} genericConstructor 
 * @returns {GenericConstructor<Anonymous>}
 */
export function useSObject(GenericConstructor, _fields, recordTypeId = 'default') {
  const {objectApiName} = _fields[0];
  const objectRefName = `${objectApiName.slice(0,-1)}ref`;
  const objectInfoName = `${objectApiName.slice(0,-1)}info`;

  const placeholder = class extends GenericConstructor {

    @track __SOBJECT_MXN_INFO_RESULT__;
    @track __SOBJECT_MXN_SOBJECT_REF__;
    @track __SOBJECT_MXN_RTYPE_ID__;
    @track __SOBJECT_MXN_FILTERED_PICKLIST_FIELDS__;
    __SOBJECT_MXN_PICKLIST_FIELDS__ = [];
    __SOBJECT_MXN_IS_REF_INIT__ = false;
    __SOBJECT_MXN_SOBJECT_REF_API_NAME__ = objectApiName;
    __SOBJECT_MXN_SOBJECT_REF_NAME__ = objectRefName;
    __SOBJECT_MXN_SOBJECT_INFO_NAME__ = objectInfoName; 

    @wire(getObjectInfo, {objectApiName})
    __SOBJECT_MXN_INFO_WIRED__({data, error}) {
      if(data) {
        const {fields, defaultRecordTypeId} = data;
        const filteredFields = Object.fromEntries(Object.keys(fields)
        .filter(fieldApiName => 
          _fields.map(_field =>
             _field.fieldApiName).includes(fieldApiName)
        ).map(fieldApiName => {
          if(fields[fieldApiName].dataType === 'Picklist')
            this.__SOBJECT_MXN_PICKLIST_FIELDS__.push(fieldApiName);
          return [fieldApiName, fields[fieldApiName]]
        }));

        this.__SOBJECT_MXN_RTYPE_ID__ = recordTypeId === 'default'
          ? defaultRecordTypeId
          : recordTypeId;
        
        this.__SOBJECT_MXN_INFO_RESULT__ = {
          ...filteredFields,
          defaultRecordTypeId,
          legacy: data
        };
      }
      if(error) console.error('lwc toolbox useSOBJECT', error)
    }

    @wire(getPicklistValuesByRecordType, {
      objectApiName, 
      recordTypeId: '$__SOBJECT_MXN_RTYPE_ID__'
    })
    __SOBJECT_MXN_PICKLIST_WIRED__({data, error}) {
      if(data) {
        // Make filtered list of picklist fields present in the requested fields
        this.__SOBJECT_MXN_FILTERED_PICKLIST_FIELDS__ = 
          Object.fromEntries(Object.keys(data.picklistFieldValues)
            .filter(apiName => 
              this.__SOBJECT_MXN_PICKLIST_FIELDS__.includes(apiName)
            ).map(apiName => 
              [apiName, data.picklistFieldValues[apiName]]
            )
          );
        // Attach the fields {defaultValue, controllerValue, values} from the
        // getPicklistValue() wire to the SObjectApi__info Object
        Object.keys(this.__SOBJECT_MXN_INFO_RESULT__).forEach(field => {
          if(Object.keys(this.__SOBJECT_MXN_FILTERED_PICKLIST_FIELDS__).includes(field)) {
            const {
              defaultValue, 
              controllerValue,
              values} = this.__SOBJECT_MXN_FILTERED_PICKLIST_FIELDS__[field];
            this.__SOBJECT_MXN_INFO_RESULT__[field] =  {
              ...this.__SOBJECT_MXN_INFO_RESULT__[field],
              defaultValue,
              controllerValue,
              values: values.map(({value, label}) => new Object({ value, label}))
            }
          }
        });
      }
      if(error) console.error(error, 'error')
    }

  }

  Object.defineProperty(placeholder.prototype, objectRefName, {
    get() {
      return !this.__SOBJECT_MXN_IS_REF_INIT__
        ? Object.fromEntries(_fields
          .map(field => [field.fieldApiName,'']))
        : this.__SOBJECT_MXN_SOBJECT_REF__; 
    },
    set(value) {
      this.__SOBJECT_MXN_IS_REF_INIT__ = true;
      this.__SOBJECT_MXN_SOBJECT_REF__ = value;
    }
  });
  Object.defineProperty(placeholder.prototype, objectInfoName, {
    get() {
      return this.__SOBJECT_MXN_INFO_RESULT__
    }
  });
  return placeholder;
}