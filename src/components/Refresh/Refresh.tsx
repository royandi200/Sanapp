import React from 'react';

import { IonRefresher, IonRefresherContent } from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';

import './Refresh.css'

interface PropSegment{
    onRefresh: Function
}

export function Refresh ( { onRefresh }: PropSegment ){
    
    const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    console.log('Begin async operation');
    
    setTimeout(() => {
        console.log('Async operation has ended');
        event.detail.complete();
    }, 2000);
    }
    
  return (
    <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
      <IonRefresherContent></IonRefresherContent>
    </IonRefresher>
  )
}

