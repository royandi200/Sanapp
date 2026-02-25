import React from 'react';

import './Segment.css'
import { IonSegment, IonSegmentButton } from '@ionic/react';
import { Link } from 'react-router-dom';

import {LOGO} from '../../const/imgs'


interface PropSegment{
  selected: string
}

export function Segment ( { selected }: PropSegment ){
  
  const segment = [
    {
      img: LOGO,
      imgSelected: LOGO,
      to: "/"
    },
    {
      img: LOGO,
      imgSelected: LOGO,
      to: "/"
    },
    {
      img: LOGO,
      imgSelected: LOGO,
      to: "/"
    },
    
    {
      img: LOGO,
      imgSelected: LOGO,
      to: "/"
    },
    
    {
      img: LOGO,
      imgSelected: LOGO,
      to: "/"
    },
  ]
  
  return (
    <div className={''}>
      <IonSegment>
        {
          segment.map( (obj, index) => (
            <IonSegmentButton value={''+index} key={index}>
              { selected === '1' ?
                  <img className="segment1" src={obj.img} alt=''/> :
                  <Link style={{ textDecoration: 'none' }} to={obj.to}>
                    <img className="segment1" src={obj.imgSelected} alt=''/>
                  </Link>
              }
            </IonSegmentButton>
          ))
          
        }
        
      </IonSegment>
    </div>
  )
}

