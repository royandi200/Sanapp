import React from 'react';

import './Input.css'

import { IonItem, IonLabel, IonInput, IonImg, IonSelect, IonSelectOption, IonList } from '@ionic/react';

import { Plugins, CameraResultType } from '@capacitor/core';
//import { Camera, CameraResultType } from '@capacitor/camera';

interface PropInput{
  type: 'date' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' | 'time'
  positionTxt: 'fixed' | 'stacked' | 'floating'
  txt: string
  value: string
  onInput: Function
  icon?: any
  className?: any
  icon2?:any
  icon3?:any
  onClickIcon?: Function
  onClickIcon2?: Function
  onClickIcon3?: Function
  disabled?: boolean
  onlyIcon?: boolean
  onKeyDown?: Function
}
interface PropInputSelect{
  positionTxt: 'fixed' | 'stacked' | 'floating',
  data: any[],
  onInput: Function,
  icon?: any,
  txt?: string,
  placeholder?: string
  value: string
  className?: any,
  propTxt: string,
  propId: string
}

export function Input ( { onKeyDown, type, positionTxt, txt, value, onInput, icon, icon2, icon3, onClickIcon, onClickIcon2, onClickIcon3, className, disabled = false, onlyIcon = false}: PropInput){
  
  return (
    <IonItem lines="none" className={ className ? className : `${className} backColor`}>
        
        <IonLabel position={positionTxt}>{txt}</IonLabel>
        <IonInput  onKeyDown={(e: any) => { onKeyDown && onKeyDown(e) }} disabled={disabled} type={type} value={value} onInput={(e: any) => onInput(e.target.value) } className='borderBottom'/>
        { icon &&
          <IonImg className={ onlyIcon ? 'inputIconOnly ' : 'inputIcon'} src={icon} slot="start" onClick={() => onClickIcon && onClickIcon()}/>
        }
        { icon2 && onClickIcon2 &&
          <IonImg className="inputIcon2" src={icon2} slot="end" onClick={() => onClickIcon2()} />
        }
        { icon3 && onClickIcon3 &&
          <IonImg className="inputIcon3" src={icon3} slot="end" onClick={() => onClickIcon3()} />
        }
    </IonItem>
  )
}

export function InputSelect ( {positionTxt, data, txt, onInput, icon, placeholder, value, className, propTxt, propId}: PropInputSelect){
  
  return (
    <IonItem className={ className ? className : `${className} backColor`}>
      
        <IonLabel position={positionTxt}>{txt}</IonLabel>
        { icon &&
          <IonImg className="iconCbb" src={icon} slot="start"/>
        }
        <IonSelect 
          placeholder={placeholder}
          interface="alert"
          value={value}
          onIonChange={(e:any) => {onInput(e.target.value)}}
        >
          {
            data.map( (obj, i) => 
             <IonSelectOption key={i} value={obj[propId]}>{obj[propTxt]}</IonSelectOption>
            )
          }
        </IonSelect>
        

    </IonItem>
  )
}

export async function takePicture() {
  
  const { Camera } = Plugins;
  const image = await Camera.getPhoto({
    quality: 80,
    allowEditing: false,
    resultType: CameraResultType.DataUrl,
    correctOrientation: true,
    saveToGallery: true
  });
  
  var imageUrl = ""//image.dataUrl;
  // Can be set to the src of an image now
  //console.log("imageUrlimageUrlimageUrl", imageUrl)

  
  return imageUrl
}

