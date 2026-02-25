import { 
  IonContent,
  IonPage,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCheckbox,
  IonLabel,
  IonImg,
  IonLoading,
  IonModal,
} from '@ionic/react';

import React, { useState, useCallback, useEffect } from 'react';

import { getPoliticas, signUp } from '../../api/public/public'

import './Register.css'

import '../../theme/variables.css';


import { Map } from '../../components/Map/Map';

import { 
  LOGO,
  EMAIL,
  CARD,
  USER,
  PHONE,
  NEXT,
  BACK
} from '../../const/imgs'
import { Link } from 'react-router-dom';
import { Input, InputSelect } from '../../components/Inputs/Input';
import { Toast } from '../../components/Alert/Alert';

import * as EmailValidator from 'email-validator';

import { TYPE } from '../../const/functions';
//import { Device } from '@capacitor/device';

import { Plugins } from '@capacitor/core';

  const { Device } = Plugins;

  const initialState = {
    nombre: '',
    apellido: '',
    tipo: TYPE.DOCCC,
    documento: '',
    email: '',
    clave: '12345',
    clave2: '12345',
    nombreTienda: '',
    telefono: '',
    condiciones: false,
    //neighborhood: '',
    //locality: '',
    //department: '',
    //city: '',
    //addres:''
  }

  const opc = [
  {
    value: TYPE.DOCCC,
    txt: 'CC'
  },
  {
    value: TYPE.DOCCE,
    txt: 'CE'
  },
  ]

  const txt1 = 'Crear cuenta'
  const txt2 = 'Mi Tienda'
  const txt3 = 'Aceptar términos y condiciones'

  
  
  let datosDevice: any ={}
  Device.getInfo().then( (device: any) =>{
    datosDevice = device
  })

  const Register: React.FC<any> = (props) => {

    const [formData, setFormData] = useState<any>(initialState)
    
    const [neighborhood, setNeighborhood] = useState('');
    const [locality, setLocality] = useState('');
    const [department, setDepartment] = useState('');
    const [city, setCity] = useState('');
    const [addres, setAddres] = useState('');
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    
    const [condiciones, setCondiciones] = useState(false)

    const [toast, setToast] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [showLoading, setShowLoading] = useState(false);
    
    const [modal, setModal] = useState(false)

    const [txtPolitica, setTxtPolitica] = useState('')

    const [toastClass, setToastClass] = useState('');
  
    const preSetCondiciones = (cond: any) => {
      setCondiciones(cond)
      setFormData({
        ...formData,
        'condiciones': cond
      })
    }
    
    const Save = () => {

      if(!validate())
        return
      
      const fetchData = async () => {
        
        setShowLoading(true);

        const obj = {
          name: formData.nombre,
          lastName: formData.apellido,
          identification: formData.documento,
          idTypeDoc: formData.tipo,
          password: formData.clave,
          email: formData.email,
          store:{
            name: formData.nombreTienda,
            phone: formData.telefono,
            locality: locality,
            neighborhood: neighborhood,
            addres: addres,
            city: city,
            department: department,
            idStatus: 1,
            latitude: latitude,
            longitude: longitude
          },
          device: datosDevice
        }
        
        try {
          const respSingUp = await signUp(obj);
          if(respSingUp.data.status === -1){
            setMensaje('Identificación o email ya existe')
            setToastClass('ToasError')
          }else {
            setFormData({...initialState})
            setToastClass('')
            setMensaje('Registrado exitosamente')
          }
          setShowLoading(false);
          setToast(true)
        } catch (error) {
          setToastClass('ToasError')
          setMensaje('Ups! error en la petición')
          setShowLoading(false);
          setToast(true)  
        }
        
        
        
      };
      fetchData()
    }

    const setField = useCallback(
      (fieldName = '') => (value:any) =>{
        if(value.persist) value.persist()
        setFormData({
          ...formData,
          [fieldName]: value.persist ? value.target.value.trim() : value.trim()
        })
      }, [formData] 
    )

    const validate = () => {
      let count = 0 
      let requeridos = ''
      let newKey
      
      for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
          if(!formData[key] && count === 0){
            if(key === 'clave2') newKey = 'Confirmar clave'
            else newKey = key  
            requeridos += `${newKey}, `
            count += 1
          }
        }
      }

      requeridos =  requeridos.slice(0, requeridos.length-2);

      let msj = ''

      if(count > 1)
        msj += ` Los campos ${requeridos} son obligatorios` 
      if(count === 1)
        msj += ` El campo ${requeridos} es obligatorio.`

      if(formData.clave !== formData.clave2){
        msj += ` Las claves no coinciden `
        count += 1
      }

      if(addres.trim() === ''){
        msj += ` Selecciona la dirección de la tienda `
        count += 1
      }

      if(!EmailValidator.validate(formData.email) && count === 0){
        msj +=  ` ${formData.email} no es un email válido`
        count += 1
      }
      
      if(formData.clave.length < 4){
        msj +=  ` La clave debe contener mínimo 4 caracteres`
        count += 1
      }

      if(formData.telefono.length !== 10){
        msj +=  ` Debe ser un número celular`
        count += 1
      }

      if(count) {
        setToastClass('ToasError')
        setMensaje(msj)
        setToast(true) 
      }

      return !count ? true : false
      
    }

    useEffect( () => {
      const getPolitica = async () => {
        const { data } = await getPoliticas();
        //se utilizo img ya que es el campo mas grande, de esta manera insertar el texto tan largo
        setTxtPolitica(data.img)
      }
      getPolitica()
    }, [])

    return (
      <IonPage>
        <IonContent className="ion-padding">
          
          <IonLoading
            isOpen={showLoading }
            onDidDismiss={() => setShowLoading(false)}
            spinner={null}
            message={`<img src="https://www.sanapp.info/Imagenes/prueba.gif" class="loading" alt="San andres"/>`}
          />

          <IonModal isOpen={modal} onDidDismiss={ () => setModal(false)}>
            <IonImg
              className="categoryBack"
              src={BACK}
              onClick={ () => setModal(false) }
            />
            <div className={'RegisterTxtTermino ion-text-justify'}>
              <td className='registetTc' dangerouslySetInnerHTML={{__html: txtPolitica}} />
            </div> 
          </IonModal>
          
          {Toast( {
            message: mensaje,
            open: toast ,
            onDissmis: () => { 
              setToast(false)
            },
            showCloseBtn: true,
            duration: 3000,
            position:'bottom',
            className: toastClass
            }
          )}
          
          <div className="registerContent">
            <div className="registerContent2">
              <IonGrid className=''>
                <IonRow>
                  <IonCol className="ion-text-center icon">
                    <img className="registerImg" src={LOGO} alt=''/>
                  </IonCol>
                </IonRow>
              </IonGrid>   

              <p className="ion-text-center registerMarginTop2 font40 fontmilkshake">
                {txt1}
              </p>

              <Input
                txt="Nombres"
                onInput={setField('nombre')}
                value={formData.nombre}
                positionTxt={"floating"}
                type={'text'}
                icon={USER}
              />

              <Input
                txt="Apellidos"
                onInput={setField('apellido')}
                value={formData.apellido}
                positionTxt={"floating"}
                type={'text'}
                icon={USER}
              />

              <IonGrid className='gridNoPadding' >
                <IonRow>
                  <IonCol className="ion-text-center columNoPadding paddingTop" size="5">
                    <InputSelect
                      txt="Tipo"
                      onInput={setField('tipo')}
                      data={opc}
                      positionTxt={"floating"}
                      value={formData.tipo}
                      icon={CARD}
                      propId={'value'}
                      propTxt={'txt'}
                    />
                  </IonCol>
                  <IonCol className="ion-text-center columNoPadding2" size="7">
                    <Input
                      txt="Documento"
                      onInput={setField('documento')}
                      value={formData.documento}
                      positionTxt={"floating"}
                      type={'tel'}
                      icon={CARD}
                    />
                  </IonCol>
                </IonRow>
              </IonGrid> 
              
              <Input
                txt="Correo Electrónico"
                onInput={setField('email')}
                value={formData.email}
                positionTxt={"floating"}
                type={'text'}
                icon={EMAIL}
              />
{/*
              <Input
                txt="Contraseña"
                onInput={setField('clave')}
                value={formData.clave}
                positionTxt={"floating"}
                type={'password'}
                icon={LOCK}
              />

              <Input
                txt="Confirmar contraseña"
                onInput={setField('clave2')}
                value={formData.clave2}
                positionTxt={"floating"}
                type={'password'}
                icon={LOCK}
              />
  */
  }

              <p className="ion-text-center font40 fontmilkshake">
                {txt2}
              </p>

              <Input
                txt="Nombre"
                onInput={setField('nombreTienda')}
                value={formData.nombreTienda}
                positionTxt={"floating"}
                type={'text'}
                icon={USER}
              />

            <div className="map">
              <Map
               loading={setShowLoading}
               setAddres={setAddres}
               setCity={setCity}
               setDepartment={setDepartment}
               setLocality={setLocality}
               setNeighborhood={setNeighborhood}
               setLatitude={setLatitude}
               setLongitude={setLongitude}
              />
            </div>
              <br/><br/>
              <br/><br/>
              <Input
                txt="Celular"
                onInput={setField('telefono')}
                value={formData.telefono}
                positionTxt={"floating"}
                type={'tel'}
                icon={PHONE}
              />

              <IonGrid>
                <IonRow>
                  <IonCol size={'10'}>
                    <IonLabel className="font17 ion-text-wrap fontHelvetica" onClick={ () => setModal(true)}>{txt3}</IonLabel>
                  </IonCol>
                  <IonCol size={'2'}>
                      <IonCheckbox  checked={condiciones} onClick={ () => preSetCondiciones(!condiciones)}/>
                  </IonCol>
                </IonRow>
              </IonGrid>

              <IonButton className='marginTop3 registerBtn'  onClick={ () => Save()}>
                <IonImg className="icon02" src={NEXT} slot="start"/>
                Siguiente
              </IonButton>

            </div>
          </div>

          <div className='ion-text-center registerMarginTop3 '>
            <Link className="registerSing fontHelvetica" style={{ fontSize: '14px',  textDecoration: 'none', color: '#A6BCD0'}} to="/login">
              VOLVER
            </Link>
          </div>
          

        </IonContent>
      </IonPage>
    );
    
  }


export default Register;
