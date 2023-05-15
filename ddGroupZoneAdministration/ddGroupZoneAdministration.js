import { LightningElement, track, wire } from 'lwc';

import getBAMList from '@salesforce/apex/SC087_GroupZoneAdminiController.getBAMList';
import getSectorList from '@salesforce/apex/SC087_GroupZoneAdminiController.getSectorList';
import getZoneManagerHistories from '@salesforce/apex/SC087_GroupZoneAdminiController.getZoneManagerHistories';
import createZoneManagerHistory from '@salesforce/apex/SC087_GroupZoneAdminiController.createZoneManagerHistory';
import getZMList from '@salesforce/apex/SC087_GroupZoneAdminiController.getZMList';
import deleteZoneManagerHistory from '@salesforce/apex/SC087_GroupZoneAdminiController.deleteZoneManagerHistory';

import 'c/stellCustomProperties'

import { 
  comboboxify,
  useReactiveBinding,
  useFormValidation, 
  useDialog,
  Toaster 
} from 'c/lwcToolbox'

export default class ddGroupZoneAdministration extends  
  useDialog(
  useFormValidation(
  useReactiveBinding(
  LightningElement))) {

  @track StartDate__c;
  @track EndDate__c;
  @track BAM__c;
  @track Zone__c;
  @track ZM__c;

  connectedCallback() {
    this.getZoneManagerHistories();
  }

  @track bams;
  @wire(getBAMList)
  _bams({data}) {
    if(data) 
      this.bams = comboboxify(data,{label:'_',value:'_'})   
  }
 
  @track sectors;
  @wire(getSectorList, {bam: '$BAM__c'})
  _sectors({data}) {
    if(data) {
      this.sectors = comboboxify(data, {
        label: ['Zone__r.ConnexionZM__r.LastName', 'Zone__r.ConnexionZM__r.FirstName'],
        value: ['Zone__c']
      })
    }
  }
  
  @track zoneManagers
  @wire(getZMList)
  _zoneManagers({data}) {
    if(data) 
      this.zoneManagers = comboboxify(data,{
        label: ['LastName', 'FirstName'],
        value: ['Id']
      }); 
  }

  @track historyRecords = [];
  async getZoneManagerHistories() {
    try {
      this.historyRecords = await getZoneManagerHistories();
      console.log('getZoneManagerHistories', this.historyRecords);
    } catch (error) {
      console.error('getZoneManagerHistories => error',error)
    }
  }

  get historyRecordsNotEmpty() {
    return this.historyRecords.length !== 0;
  }

  async handleCreateNewConfig() {
    const start = new Date(this.StartDate__c);
    const end = new Date(this.EndDate__c);
    const today = new Date(Date.now());
    if(this.isFormValid) 
      if(start.getTime() <= end.getTime()) 
        if(start.getTime() >= today.getTime() && end.getTime() >= today.getTime()) 
          this.createZoneManagerHistory();
        else 
          Toaster.error("Date debut et fin doivent être supérieur à la date d'aujourd'hui");
      else 
        Toaster.error('Date fin doit être supérieur ou égale à la date debut');  
    else 
      Toaster.error('Veuillez corriger toutes les erreurs surlignées et réessayer');
  }

  async createZoneManagerHistory() {
    const fields = ['BAM__c', 'StartDate__c', 'EndDate__c', 'Zone__c', 'ZM__c'];
    const newZmConfig = [...fields].reduce((zmConf, field) => 
      Object.assign(zmConf, {[field]: this[field]}), {}
    );
    try {
      this.historyRecords = await createZoneManagerHistory({newZmConfig});
      Toaster.success("Enregistrement est créé avec succès!");
      fields.forEach(field => this[field] = undefined);
    } catch (error) {
      console.error('createZoneManagerHistory => exception',error);
    } 
  }

  handleClickEdit() {

  }
  async handleClickDelete(e) {
    const isOk = await this.openDialog({
      description:'',
      header: 'Attention',
      content: `Êtes-vous sûre de vouloir supprimer cet enregistrement ?`,
      action: {
        yes: 'Oui',
        no: 'Non'
      },
      headerStyle: `--slds-c-modal-header-text-color: var(--stellTangerineDarker)`
    });
    if(isOk) {
      const idToDelete = e.detail.value;
      const selectedHistoryObj = this.historyRecords.find(historyRecord => historyRecord.id === idToDelete);
      const q = `[data-id=${idToDelete}]`
      console.log(this.template.querySelector(q),'element', idToDelete, q);
      // this.template.querySelector(`[data-row='${idToDelete}']`).classList.add('deleted');
      // await deleteZoneManagerHistory({selectedHistoryObj});
    }
  }

  handleBamChanged(e) {
    this.bind(e);
    this.Zone__c = undefined;
    console.log('bam changed', this.Zone__c, this.BAM__c)
  }
}