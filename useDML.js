import { updateRecord, createRecord, deleteRecord} from 'lightning/uiRecordApi';

/**
 * @template T
 * @typedef {new (...args: any[]) => T} GenericConstructor
 */
/**
 * @template T
 * @param {GenericConstructor<T>} genericConstructor 
 * @returns {GenericConstructor<Anonymous>}
 */
export function useDML(genericConstructor) {
  return class Anonymous extends genericConstructor {

    /**
     * @param {Array<RecordId>} ids 
     */
    async deleteRecords(ids) {
      await Promise.allSettled(ids.map(this.deleteRecord))
    }
    /**
     * @param {RecordId} id 
     */
    async deleteRecord(id) {
      await deleteRecord(id);
    }
    async saveRecord(record, apiName = this['__SOBJECT_MXN_SOBJECT_REF_API_NAME__']) {
      return record.Id
        ? await updateRecord( {fields: record} )
        : await createRecord( {apiName, fields: record} )
    }
    async saveRecords(records, apiName = this['__SOBJECT_MXN_SOBJECT_REF_API_NAME__']) {
      return await Promise.allSettled(records.map(record => this.saveRecord(record, apiName)))
      
    }
  }
}
