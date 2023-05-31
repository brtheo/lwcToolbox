import { LightningElement, api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class LwcToolboxDialog extends LightningModal {
  @api content;
  @api action = {yes:'', no: ''};
  @api header;
  @api footer;
  @api isSimple = false;
  @api waitForInput = false;

  @api headerStyle;

  @api actionNoStyle = `
    --slds-c-button-neutral-color-background: var(--stellTangerineDarker);
    --slds-c-button-text-color: var(--stellWhite, white);
  `;

  @api bodyStyle = `
    font-size: 1rem;  
  `;

  @api footerStyle = `
    display: flex;
    flex-direction: column;
    gap: 1rem;
  `;

  @api footerActionsStyle = `
    display: flex;
    gap: 5rem;
    place-content: center;
  `;

  @api footerHelperStyle = `
    font-size: .7rem;
    font-style: italic;
    text-align: left;
  `;

  renderedCallback() {
    this.template.querySelector('[data-body]')
    .insertAdjacentHTML('beforeend', this.content); 
  }

  get returnableData() {
    return Object.fromEntries(
      [...this.template.querySelectorAll('[data-returned]')].map($input => 
        [$input.name,$input.value]
      )
    )
  }
  
  actionYesHandler() {
    if(this.waitForInput) 
      this.close(this.returnableData)
    else
      this.close(Boolean(1));
  }
  actionNoHandler() {
    this.close(Boolean(0));
  }
  closeModal() {
    this.actionNoHandler();
  }
}

export function useDialog(genericConstructor) {
  return class extends genericConstructor {
    async openDialog(...args) {
      return await LwcToolboxDialog.open(...args);
    }
  }
}
/**
 * @typedef {Object} InputParam
 * @prop {string} label
 * @prop {string} value
 * @prop {string} type
 * @prop {boolean=} disabled
 * @prop {boolean=} required
 * @prop {boolean=} returned
 * @prop {string=} name
 */
/**
 * @callback Input
 * @param {InputParam} opt
 * @returns {string}
 */
export const Dialog = {
  /** @type {Input} */
  Input: (opt) => {
    const {label, value, type} = opt;
    
    return /*html*/`
    <div class="slds-form-element">
      <label class="slds-form-element__label">${label}</label>
      <div class="slds-form-element__control">
        <input 
          class="slds-input"
          type="${type}" 
          value="${value}"
          ${opt.disabled ? 'disabled' : ''}
          ${opt.required ? 'required' : ''}
          ${opt.returned ? 'data-returned' : ''}
          ${opt.name ? `name="${opt.name}"` : ''}
          />
      </div>
    </div>
    `
  }
}