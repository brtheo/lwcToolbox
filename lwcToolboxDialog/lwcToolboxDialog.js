import { LightningElement, api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class LwcToolboxDialog extends LightningModal {
  @api content;
  @api action = {yes:'', no: ''};
  @api header;
  @api footer;
  @api isSimple = false;

  @api headerStyle;

  @api actionNoStyle = `
    --slds-c-button-neutral-color-background: var(--stellTangerineDarker);
    --slds-c-button-text-color: var(--stellWhite, white);
  `;

  @api bodyStyle = `
    font-size: 1rem;  
  `;

  @api footerWStyle = `
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
  
  actionYesHandler() {
    this.close(1);
  }
  actionNoHandler() {
    this.close(0);
  }
  closeModal() {
    this.actionNoHandler();
  }
}

export function useDialog(genericConstructor) {
  return class extends genericConstructor {
    async openDialog(...args) {
      return Boolean(await LwcToolboxDialog.open(...args));
    }
  }
}

/**
 * 
 const result = await BbiDialog.open({
            description: '',
            header: this.label.EselleSPPopinTitle,
            content,
            footer: this.label.EselleSPPopinFooter,
            action: {
                yes: 'Sí', 
                no: 'No'
            }
        });
 checkResult(result) {
  return result === 'YES' 
  && (
      result === 'NO'
      || typeof result !== 'undefined'
  )
}



**/