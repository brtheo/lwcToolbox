import { getObjectInfos, getPicklistValuesByRecordType } from "lightning/uiObjectInfoApi";
import { wire, track } from 'lwc';
import { pick } from "./utils";
import { trace, pick } from './utils';
const MXN_NAME = 'useSObject';

type Field = {
    fieldApiName: string;
    objectApiName: string;
}
type infoField = {
  apiName: string;
  dataType: string;
  label: string;
}
type infoResult = {
  defaultRecordTypeId: string;
  fields: infoField[];
  apiName: string;
}
type infosResults = {
  results: {
  statusCode: number;
  result: infoResult
}[]
}

const isCustomObject = (objectApiName: string) => objectApiName.endsWith('__c'),
      trimCustomIdentifier = (objectApiName: string) => objectApiName.slice(0,-1),
      sanitizeApiName = (objectApiName: string) => 
        isCustomObject(objectApiName) 
          ? trimCustomIdentifier(objectApiName)
          : `${objectApiName}__`

export function useSObjects(GenericConstructor: any, _fieldsArray: Field[][], recordTypeId = 'default') {
  const fieldsByObjectApiName = _fieldsArray.reduce((acc, curr) => Object.assign(acc, Object.fromEntries([[curr[0].objectApiName, curr]])),{}) as {[key:string]:Field[]}
  const objectApiNames: Array<string> = Object.keys(fieldsByObjectApiName);
  const objectRefNames = objectApiNames.map(name => Object.fromEntries([[name, `${sanitizeApiName(name)}ref`]]));
  const objectInfoNames = objectApiNames.map(name => Object.fromEntries([[name, `${sanitizeApiName(name)}info`]]));

  const placeholder = class extends GenericConstructor {

    @track __SOBJECT_MXN_INFO_RESULTS__;
    @track __SOBJECT_MXN_SOBJECT_REFS__;
    @track __SOBJECT_MXN_RTYPE_IDS__;
    @track __SOBJECT_MXN_PICKLIST_FIELDS_BY_OBJECT_API_NAME__ = objectApiNames.map(name => Object.fromEntries([[name, Array(fieldsByObjectApiName[name].length)]]));
    //__SOBJECT_MXN_PICKLISTS_FIELDS__ = {};
    __SOBJECT_MXN_IS_REFS_INIT__ = objectApiNames.map(name => Object.fromEntries([[name, false]]))
    __SOBJECT_MXN_SOBJECT_REF_API_NAMES__ = objectApiNames;
    __SOBJECT_MXN_SOBJECT_REF_NAMES__ = objectRefNames;
    __SOBJECT_MXN_SOBJECT_INFO_NAMES__ = objectInfoNames; 

    @wire(getObjectInfos, {objectApiNames})
    __SOBJECT_MXN_INFOS_WIRED__({data, error}: {data: infosResults}) {
      if(data) {
        const results: infoResult[] = data.results
          .filter(result => result.statusCode === 200)
          .map(result => pick('fields','defaultRecordTypeId','apiName').from(result));
        
        
        /** Make a filtered object containing only the fields passed as arguments */
        const filteredFields = results.map(({fields, apiName}) => 
          Object.fromEntries(Object.keys(fields)
          .filter(fieldApiName => 
            fieldsByObjectApiName?.[apiName].map(field =>
              field.fieldApiName).includes(fieldApiName)
          ).map(fieldApiName => {
            /**
             * Keeping track of the picklist type fields
             * Useful for the getPicklistValuesByRecordType wire method
             */
            if(fields[fieldApiName].dataType === 'Picklist')
              this.__SOBJECT_MXN_PICKLIST_FIELDS_BY_OBJECT_API_NAME__[apiName].push(fieldApiName);
            return [fieldApiName, fields[fieldApiName]]
          }))
        )


        /*this.__SOBJECT_MXN_RTYPE_IDS__ = recordTypeId === 'default'
          ? defaultRecordTypeId
          : recordTypeId;*/
        
        this.__SOBJECT_MXN_INFO_RESULT__ = {
          ...filteredFields,
          defaultRecordTypeId,
          legacy: data
        };
      }
      if(error) trace(MXN_NAME, error)
    }

    @wire(getPicklistValuesByRecordType, {
      objectApiName, 
      recordTypeId: '$__SOBJECT_MXN_RTYPE_ID__'
    })
    __SOBJECT_MXN_PICKLIST_WIRED__({data, error}) {
      if(data) { 
        /**
         * Make filtered list of picklist fields present in the requested fields
         * if the length of retrieved picklistFieldValues is different from the length 
         * of the class prop that keep track of picklist fields
         */
        const filteredPicklistResults = 
          (Object.keys(data.picklistFieldValues).length !== this.__SOBJECT_MXN_PICKLIST_FIELDS__.length)
            ? Object.fromEntries(Object.keys(data.picklistFieldValues)
              .filter(apiName => 
                this.__SOBJECT_MXN_PICKLIST_FIELDS__.includes(apiName)
              ).map(apiName => [apiName, data.picklistFieldValues[apiName]] )
            ) : data.picklistFieldValues;
        /**
         * Attach the fields {defaultValue, controllerValue, values} from the
         * getPicklistValue() wire to the SObjectApi__info Object
         */  
        Object.keys(this.__SOBJECT_MXN_INFO_RESULT__).forEach(field => {
          if(Object.keys(filteredPicklistResults).includes(field)) {
            const {
              defaultValue, 
              controllerValue,
              values } = filteredPicklistResults[field];
            this.__SOBJECT_MXN_INFO_RESULT__[field] = {
              ...this.__SOBJECT_MXN_INFO_RESULT__[field],
              defaultValue,
              controllerValue,
              values: values.map(({value, label}) => new Object({ value, label}))
            }
          }
        });
      }
      if(error) trace(MXN_NAME, error)
    }

  }

  objectApiNames.forEach(name => {

    Object.defineProperty(placeholder.prototype, objectRefNames[name], {
      get() {
        return !this.__SOBJECT_MXN_IS_REFS_INIT__[name]
          ? Object.fromEntries(fieldsByObjectApiName[name]
            .map(field => [field.fieldApiName,'']))
          : this.__SOBJECT_MXN_SOBJECT_REFS__[name]; 
      },
      set(value) {
        this.__SOBJECT_MXN_IS_REFS_INIT__[name] = true;
        this.__SOBJECT_MXN_SOBJECT_REFS__[name] = value;
      }
    });

    Object.defineProperty(placeholder.prototype, objectInfoNames[name], {
      get() {
        return this.__SOBJECT_MXN_INFO_RESULT__
      }
    });


  })

  
  return placeholder;
}
