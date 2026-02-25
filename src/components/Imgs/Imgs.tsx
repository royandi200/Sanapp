import React from 'react';
import { IonImg } from '@ionic/react';

import './imgs.css'

export interface PropImgTxt{
  img: string,
  txt?: string
  className?: string
}
export function ImgTxt ( props: PropImgTxt){
  
  return (
    
    <div className={ props.className ? 'Imgimg1' : 'Imgimg1'}>
      <IonImg src={props.img}  className={'border'}/>
      <div className={'imgBlackBack'}>
        <div className={'imgPadding ion-text-wrap'}>
          {props.txt}
        </div>
      </div>
    </div>
    
  )
}


