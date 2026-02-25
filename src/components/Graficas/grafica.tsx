import React from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';

import './Grafica.css'

export interface PropIGrafica{
  data: [],
  reto: number,
  dias: number,
  semana: [any]
}

export function ItemMod ( props: PropIGrafica){
  
  return (
    <div >
      
      <IonGrid >
        <IonRow  >
          <IonCol className="ion-text-center txtWhite txtSize2" size="3">
            {props.reto + 'Retos'}
          </IonCol>
          <IonCol className="ion-text-end " size="3">
            <div className={'txtWhite txtSize3'}>
              {props.dias + 'días'}
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>
      {props.semana.map( (semana) => {
        return (
        <div>
          <IonGrid >
            <IonRow  >
              <IonCol className="ion-text-start txtSize1" size="6">
                {semana.titulo}
              </IonCol>
            </IonRow>
          </IonGrid>
          {semana.actividades.map( (actividad:any) => {
            return (
            <IonGrid >
              <IonRow  >
                <IonCol className="ion-text-start txtSize1" size="6">
                  {actividad.titulo}
                </IonCol>
                <IonCol className="ion-text-end txtSize1" size="6">
                  {actividad.hecha}
                </IonCol>
              </IonRow>
            </IonGrid>)
          })}
        </div>)
      })}
      


      
    </div>
  )
}

