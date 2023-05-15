import { LightningElement,wire,api, track} from 'lwc';
	
import imgEjCustomCompactLayout from '@salesforce/resourceUrl/SC069EJCustomCompactLayout';

import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import Nom_ou_raison_sociale__c from '@salesforce/schema/Quote__c.Nom_ou_raison_sociale__c';
import NomVendeur__c from '@salesforce/schema/Quote__c.NomVendeur__c';
import NoOffre__c from '@salesforce/schema/Quote__c.NoOffre__c';
import NoDemande__c from '@salesforce/schema/Quote__c.NoDemande__c';
import NoContrat__c from '@salesforce/schema/Quote__c.NoContrat__c';
import LibelleCommercialVehicule__c from '@salesforce/schema/Quote__c.LibelleCommercialVehicule__c';
import StatutOffre__c from '@salesforce/schema/Quote__c.StatutOffre__c';
import LCDV__c from '@salesforce/schema/Quote__c.LCDV__c';
import LibPcomPfin__c from '@salesforce/schema/Quote__c.LibPcomPfin__c';

const fields = [Nom_ou_raison_sociale__c,NomVendeur__c,NoOffre__c,NoDemande__c,NoContrat__c,LibelleCommercialVehicule__c,StatutOffre__c,LCDV__c,LibPcomPfin__c]

import getType from '@salesforce/apex/CT008_SC69EJCustomCompactLayout.getType';

import {useRecordFields} from 'c/useRecordFields'
export default class DdEJCustomCompactLayout extends useRecordFields(LightningElement, {recordId: '$recordId', fields}){
  @api recordId
  @track TypeBienLabel
  @wire (getType,{ recordid: '$recordId' })
  wiredGetType({error,data}){
    if (data) {
      console.log('dataz is here :'+data)
      this.TypeBienLabel  = data;
      this.error = undefined;
  } else if (error) {
    console.log('error is here :'+error)
      this.error = error;
      this.TypeBienLabel  = undefined;
  }
  }

  

  RESSOURCEimgEjCustomCompac=imgEjCustomCompactLayout

  
}