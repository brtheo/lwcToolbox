import { refreshApex } from '@salesforce/apex';
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