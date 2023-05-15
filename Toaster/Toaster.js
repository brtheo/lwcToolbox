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
  