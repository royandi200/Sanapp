import React from 'react';
import { IonAlert, IonToast } from '@ionic/react';

import './Alert.css'

interface AlertProps{
  open: boolean 
  onDissmis: Function
  header: string
  subH: string
  message: string
  buttons: any[]
}

interface ToasProps{
  message: string
  onDissmis: Function
  open: boolean
  showCloseBtn?: boolean
  closeTxt?: string
  position?: 'top' | 'bottom' | 'middle';
  duration?: number 
  className?: string
}

export function Confirm ( props: AlertProps ){
  return (
    <IonAlert
      isOpen={props.open}
      onDidDismiss={() => props.onDissmis}
      header={props.header}
      subHeader={props.subH}
      message={props.message}
      buttons={props.buttons}
    />
  )
}

export function Toast ( props: ToasProps ){
  return (
    <IonToast
      isOpen={props.open}
      onDidDismiss={() => props.onDissmis()}
      message={props.message}
      duration={props.duration || 3000}
      position={props.position || 'bottom'}
      closeButtonText={props.closeTxt || 'Ok'}
      color={'primary'}
      showCloseButton={props.showCloseBtn || false}
      cssClass={props.className ? props.className : ''}
    />
  )
}

