import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import useLabelCategoryApex from '@salesforce/apex/lwcToolbox.useLabelCategory';

export function useLabelCategory(genericConstructor, categoryName) {
  return class extends genericConstructor {
    @wire(useLabelCategoryApex, {categoryName: 'Copado'})
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

export { useRecordFields } from 'c/useRecordFields';
export { useDialog } from 'c/lwcToolboxDialog';

const getValueFromStringPath = (path, obj) => path.split('.').reduce((accObj, curr) => accObj[curr], obj)
// option = {label,value,description}
const SELF_IDENTIFIER = '_';
export function comboboxify(input, {value,label, description}) {
  const templater = (input, val) => input.map(str => str === SELF_IDENTIFIER 
    ? val 
    : getValueFromStringPath(str, val)
  ).join(' ');
  const getValueForKey = (key, val) => key === SELF_IDENTIFIER ? val : templater(key,val);

  const mappedObject = val => Object.create({
    label: getValueForKey(label, val),
    value: getValueForKey(value, val)
  });


  return input.map(val => description !== undefined 
    ? Object.assign(mappedObject(val), {description: getValueForKey(description, val)} ) 
    : mappedObject(val));
}

export function useReactiveBinding(genericConstructor) {
  return class extends genericConstructor {
    bind(e) {
      const {currentTarget} = e;
      const _bind = currentTarget.dataset['bind'];
      this[_bind] = e.detail.value;      
    }
  }
}

export function useFormValidation(genericConstructor) {
  return class extends genericConstructor {
    get isFormValid() {
      return [...this.template.querySelectorAll('[data-checkable]')]
      .reduce((acc,$input) => 
        acc && $input.reportValidity(), 
        true
      );
    }
  }
}

const TOAST_VARIANTS = ['error','success', 'info', 'warning'];

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
  
