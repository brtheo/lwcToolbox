import { api } from 'lwc';
import LightningModal from 'lightning/modal';
const delay = (t) => new Promise((resolve) => setTimeout(resolve, t));
/**
 * @typedef {Object} Options
 * @param {boolean} autoClose
 */
const OPTIONS = {
  autoClose: false
};
/**
 * @param {CSSStyleSheet} stylesheet - The dynamic stylesheet
 * @param {HTMLTemplateElement} HTMLTemplate - dynamic template

 */
// * @param {Options} options
export const createModal = (stylesheet, HTMLTemplate, callbacks = false) => {
  class Modal extends LightningModal {
    // Data used in our template accessible through the short key '$'
    @api $;
    // Actual content of the modal
    @api HTMLTemplate;
    // Rendering our dynamic modal content

    $YES; // <lightning-button data-yes>Close the modal by saying NO</lightning-button>
    $NO; // <lightning-button data-no>Close the modal by saying NO</lightning-button>
    #IS_YIELDING; // if we expect a return value from the modal, like an input => <lightning-input data-yield="foo" value={$.value}></lightning-input>
    #INIT = false; // keeping track of the init state to not set listeners twice

    CLOSE_BY = {  
      YES: _ => this.close(Boolean(1)), // [data-yes] button was clicked, exit by returning true
      NO: _ => this.close(Boolean(0)), // [data-no] button was clicked, exit by returning false
      // template contains inputs marked as [data-yield="<key>"], exit by returning a Map<key: string, value: string>
      YIELD: _ => this.close(Object.fromEntries([...this.template.querySelectorAll('[data-yield]')].map($input =>  [$input.dataset.yield, $input.value])))
    }

    static stylesheets = [stylesheet];
    render() {return HTMLTemplate;}   
    async renderedCallback() {
      if(!this.#INIT) {

        this.$YES = this.template.querySelector('[data-yes]');
        this.$NO = this.template.querySelector('[data-no]');
        this.#IS_YIELDING = this.template.querySelector('[data-yield]');

        this.$YES.addEventListener('click', !this.#IS_YIELDING ? this.CLOSE_BY.YES : this.CLOSE_BY.YIELD);

        if(this.$NO) this.$NO.addEventListener('click', this.CLOSE_BY.NO);

        this.#INIT = true;
        if(callbacks) 
          callbacks.forEach(cb => cb(this))
      }
    }
    
    
    disconnectedCallback() {
      this.$YES.removeEventListener('click', !this.#IS_YIELDING ? this.CLOSE_BY.YES : this.CLOSE_BY.YIELD)
      if(this.$NO) this.$NO.removeEventListener('click', this.CLOSE_BY.NO)
    }
  }
  // Returning a promise that resolves into showing the modal
  document.querySelector('lightning-overlay-container')?.remove();
  return Modal;
}