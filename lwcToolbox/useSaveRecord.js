import { updateRecord } from 'lightning/uiRecordApi';

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
    async saveRecord() {
      return await updateRecord( {fields: this[this['__SOBJECT_API_NAME__']]} );
    }
  }
}
