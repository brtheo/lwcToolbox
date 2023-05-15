/** @typedef {import('../types/ddCockpitCurrentFileStatus').FileStatusCounter} FileStatusCounter*/

import 'c/stellCustomProperties'
import { LightningElement, track, wire, api } from 'lwc';
import getFilesByUser from '@salesforce/apex/SC085_RetrieveCockpitCurrentFilesStatus.getFilesByUser';
import getCurrentFileStatus from '@salesforce/apex/SC085_RetrieveCockpitCurrentFilesStatus.getCurrentFileStatus';


export default class DdCockpitCurrentFileStatus extends LightningElement {
  /** @type {Array<FileStatusCounter>} */
  @track statuses = [];

  /** @type {Array<Promise<FileStatusCounter>>} */
  @track promises = [];

  /** @type {Number} */
  @api poolsize

  @track promisesLen

  @wire(getFilesByUser, {filteredByRole: true})
  async wiredFilesByUser({error,data}) {
    if(data) {
      console.log('filesByUser',data);
      this.promises = data.map(displayStatus => 
        getCurrentFileStatus({displayStatus})
      );

      for await (const counter of asyncPool(this.poolsize,this.promises, c => new Promise(resolve => resolve(c)))) {
        this.statuses = [...this.statuses, counter].sort((a, b) => a.order - b.order);
        console.log('ddCockpitCurrentFileStatus => statuses', counter.statusLabel, counter);
      }
      
    } else if(error) 
      console.error('ddCockpitCurrentFileStatus => Error',error);
  }

  get stillLoading() {
    return this.statuses.length < this.promises.length
  }
  
}
/**
 * 
 * @param {Number} concurrency 
 * @param {Array<Promise<T>>} iterable 
 * @param {() => Promise<T>} iteratorFn
 */
async function* asyncPool(concurrency, iterable, iteratorFn) {
  const executing = new Set();
  async function consume() {
    const [promise, value] = await Promise.race(executing);
    executing.delete(promise);
    return value;
  }
  for (const item of iterable) {
    const promise = (async () => await iteratorFn(item, iterable))().then(
      value => [promise, value]
    );
    executing.add(promise);
    if (executing.size >= concurrency) {
      yield await consume();
    }
  }
  while (executing.size) {
    yield await consume();
  }
}