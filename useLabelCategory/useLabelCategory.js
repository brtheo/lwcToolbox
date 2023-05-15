import {wire} from 'lwc';
import useLabelCategoryApex from '@salesforce/apex/lwcToolbox.useLabelCategory';

/**
 * @template T
 * @typedef {new (...args: any[]) => T} GenericConstructor
 */

/**
 * @template T
 * @param {GenericConstructor<T>} genericConstructor 
 * @param {Array<string>} categoryName
 * @returns {GenericConstructor<Anonymous>}
 */
export function useLabelCategory(genericConstructor, categoryName) {
  return class Anonymous extends genericConstructor {
    @wire(useLabelCategoryApex, {categoryName: ['Copado']})
    wiredUseLabel({error,data}) {
      console.log('labels')
      if(error) {
        console.error('labels',error)
      } else if(data){
        console.log('labels',data)
      }
    }
  }
}