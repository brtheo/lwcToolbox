import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const TOAST_VARIANTS = ['error','success', 'info', 'warning'];

/**
 * @callback Toast
 * @param {string} message - The message parameter
 * @param {string} [title=''] - The optional title parameter
 * @returns {boolean} - The return value indicating success or failure
 */

/**
 * @typedef {Object} Toaster
 * @prop {Toast} error 
 * @prop {Toast} success 
 * @prop {Toast} info 
 * @prop {Toast} warning 
 */

/**
 * @example <caption>Basic Usage</caption>
 * import {Toaster} from 'c/lwcToolbox';
 * Toaster.success('Message of the toast') //simple success toast with no title
 * Toaster.success('Message of the toast', 'Title of the toast') //simple success toast with no title
 * Toaster.error('Some error toast')
 * Toaster.warning('Some warning toast')
 * Toaster.info('Some info toast')
 * @type {Toaster}
 */
export const Toaster = TOAST_VARIANTS
  .reduce( (ret,variant) => Object.assign(ret, {
    [variant]: (message, title = '') => dispatchEvent(
      new ShowToastEvent({
        title,
        message,
        variant,
      })
    )
}),{});