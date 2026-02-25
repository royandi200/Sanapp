import React from 'react';

import './DatePicker.css'
import DayPicker from 'react-day-picker';
import { Link } from 'react-router-dom';

export interface PropDate{
  selectedDays: any[],
  fullWidth: boolean
  titulo?: string
  avatar?: string
}

export function DatePicker ( props: PropDate){
  return (
    <div >
      <DayPicker
        className={`${'estDayPicker'} ${ props.fullWidth ? 'fullWidth' : null}` }
        selectedDays={props.selectedDays}
      />
    </div>
  )
}

export function DatePickerImg ( props: PropDate){
  return (
    <div >
      { props.avatar &&
         
        <Link to="/tab3"> 
          <img className={'imgg'} src={props.avatar} alt={''}/>
       </Link>
      }
      <h3 className={'titulo'}> {props.titulo}</h3>
      <DayPicker
        className={'estDayPicker'}
        selectedDays={props.selectedDays}
      />
    </div>
  )
}

