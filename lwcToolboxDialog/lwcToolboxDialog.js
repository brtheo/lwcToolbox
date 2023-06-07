import { LightningElement, api } from 'lwc';
import LightningModal from 'lightning/modal';

/**
 * @typedef {Object} Action
 * @prop {String} yes
 * @prop {String} [no]
 */

/**
 * @typedef {Object} DialogOptions
 * @prop {String} description
 * @prop {String} header
 * @prop {String} content
 * @prop {Action} action
 * @prop {Boolean} [isSimple=false]
 * @prop {Boolean} [waitForInput=false]
 * @prop {String} [footer]
 */

export default class LwcToolboxDialog extends LightningModal {
  @api content;
  @api action = {yes:'', no: ''};
  @api header;
  @api footer;
  @api isSimple = false;
  @api waitForInput = false;

  @api headerStyle;

  @api actionNoStyle = `
    --slds-c-button-neutral-color-background: var(--stellTangerineDarker, red);
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

/**
 * @template T
 * @typedef {new (...args: any[]) => T} GenericConstructor
 */

/**
 * @example <caption>Basic usage</caption>
 * import {useDialog} from 'c/lwcToolbox';
 * export myLwc extends useDialog(LightningElement) {
 *  async handleShowModal() {
 *    const result = await this.openDialog({
 *      description: 'Modal Description',
 *      header: 'Modal Header',
 *      content: 'Modal content',
 *      action: {yes: 'Agree', no: 'Disagree'}
 *    });
 *    if(result) // meaning 'Yes' button was clicked
 *    else // 'No' or 'X' button were clicked
 *  }
 * }
 * @example <caption>Only one button</caption>
 * import {useDialog} from 'c/lwcToolbox';
 * export myLwc extends useDialog(LightningElement) {
 *  async handleShowModal() {
 *    const result = this.openDialog({
 *      ...
 *      isSimple: true
 *      action: {yes: 'Agree'}
 *    });
 *  }
 * }
 * @example <caption>Include html form and get back the datas</caption>
 * import {useDialog, Dialog} from 'c/lwcToolbox';
 * export myLwc extends useDialog(LightningElement) {
 *  async handleShowModal() {
 *    const datas = this.openDialog({
 *      ...
 *      waitForInput: true
 *      content: `
 *        ${Dialog.Input({
 *         type: text, value: localVariableToBind, label: 'Any Label', required: true, returned: true, name 'myField'
 *        })}
 *      `,
 *      ...
 *    });
 *    if(datas) console.log(datas.myField) // value of the input updated in the modal
 *  }
 * }
 * @template T
 * @param {GenericConstructor<T>} genericConstructor 
 * @returns {GenericConstructor<Anonymous>}
 */
export function useDialog(genericConstructor) {
  return class extends genericConstructor {
    /**
     * @param  {DialogOptions} args 
     * @returns {Promise<Boolean | Object.{String,String}>}
     */
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