import { refreshApex } from '@salesforce/apex';

/**
 * @template T
 * @typedef {new (...args: any[]) => T} GenericConstructor
 */
/**
 * @typedef {Object} usePollerOptions
 * @prop {string} prop;
 * @prop {string} wiredMethod;
 * @prop {number} iterrationOffset;
 * @prop {number} interval;
 */ 
/**
 * @template T
 * @param {GenericConstructor<T>} genericConstructor 
 * @param {usePollerOptions} options
 * @returns {GenericConstructor}
 */
export const usePoller = (genericConstructor, {prop, wiredMethod, iterrationOffset, interval}) => {
    
  return class extends genericConstructor {
    POLLER;
    POLLER_PROGRESS = 0;
    POLLER_ITTERATION = 0;
    STOP_OFFSET = iterrationOffset;
    initPoller() {
      let triggerProp = prop;
      this.POLLER = window.setInterval(() => {
        if(typeof prop === 'function') 
          triggerProp = prop(this?.[wiredMethod]?.data?.at(0));
        console.log(triggerProp, JSON.stringify(this?.[wiredMethod]?.data?.at(0)), 'polledres');
        if(this?.[wiredMethod]?.data?.at(0)?.[triggerProp])
            this.pollingHasEnded('OK');
        
        if(this.POLLER_ITTERATION === this.STOP_OFFSET)
          this.pollingHasEnded('POLLING_LIMIT_EXCEEDED');

        refreshApex(this?.[wiredMethod]);
        this.POLLER_ITTERATION ++;
        this.POLLER_PROGRESS += 100 / this.STOP_OFFSET;
      }, interval);
    }
    pollingHasEnded(status) {
      this.POLLER_PROGRESS = 100;
      window.clearInterval(this.POLLER);
      this.template.dispatchEvent(
        new CustomEvent('polling:end', {
          detail: {
            response: this?.[wiredMethod]?.data?.at(0),
            status
          }
        })
      );
    }
  }
}