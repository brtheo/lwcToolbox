import { updateRecord, createRecord} from 'lightning/uiRecordApi';

/**
 * @template T
 * @typedef {new (...args: any[]) => T} GenericConstructor
 */
/**
 * @template T
 * @param {GenericConstructor<T>} genericConstructor 
 * @returns {GenericConstructor<Anonymous>}
 */
export function useSaveRecord(genericConstructor) {
  return class Anonymous extends genericConstructor {
    async saveRecord(record, apiName = this['__SOBJECT_MXN_SOBJECT_REF_API_NAME__']) {
      return record.Id
        ? await updateRecord( {fields: record} )
        : await createRecord( {apiName, fields: record} )
    }
  }
}