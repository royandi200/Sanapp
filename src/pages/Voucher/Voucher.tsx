import { 
  IonContent,
  IonPage,
  IonImg,
  IonLoading
} from '@ionic/react';

import React, { useState, useEffect } from 'react';

import './Voucher.css'

import { CardVoucher } from '../../components/Cards/Card';
import { needSupport, orderFinally } from '../../api/pedido/pedido';
import { Toast } from '../../components/Alert/Alert';
import { Link } from 'react-router-dom';
import { BACK } from '../../const/imgs';
import { TYPE } from '../../const/functions';
//import dayjs from 'dayjs';

const Voucher: React.FC<any> = (props) => {
  
  const [showLoading, setShowLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [data, setData] = useState<any>([]);
    
  const [render, setRender] = useState('');
  
  const toBack = (props.location.state ? props.location.state.back ? props.location.state.back : 'catalogue' : 'catalogue')
  const showSave = (props.location.state ? props.location.state.showSave : false)
  
  const idOrder = (props.location.state ? props.location.state.idOrder : '-1')
  
  const [useFetch, setUseFetch] = useState('');
  
  const propFetch = (props.location.state ? props.location.state.fetch : useFetch || useFetch)



  const fetchData = async () => {
    setShowLoading(true);
    const result = await needSupport(idOrder);      
    setData(result.data)
    setShowLoading(false);
    
  };

  if(propFetch !== useFetch){
    setUseFetch(propFetch)
    fetchData()
  }

  const save = (obj: any ) => {
    
    if(!obj.support){
      setMensaje('Debes adjuntar el soporte de pago')
      setToast(true)
      return
    }
    
    let base64String = obj.support

    const stringLength = base64String.length - 'data:image/png;base64,'.length;

    const sizeInBytes = 4 * Math.ceil((stringLength / 3))*0.5624896334383812;
    const sizeInKb=sizeInBytes/1000;
    
    if(sizeInKb > 999){
      setMensaje('la imagenes es muy pesada')
      setToast(true)
      return
    }

    const fetchData = async () => {
      setShowLoading(true);
      obj.idStatus=TYPE.VALIDANDO
      await orderFinally(obj);
      setMensaje('El soporte de pago ha sido guardado')
      setToast(true)
      setShowLoading(false);
    };

    fetchData()

  }
  

  
  useEffect(() => {
    fetchData()
  }, [setData])
  


  return (
    <IonPage>
      <IonContent className="ion-padding">
      
      {Toast( {
        message: mensaje,
        open: toast ,
        onDissmis: () => { setToast(false)},
        showCloseBtn: true,
        duration: 3000,
        position:'bottom',
        }
      )}
      
      <IonLoading
        isOpen={showLoading}
        onDidDismiss={() => setShowLoading(false)}
        spinner={null}
        message={`<img src="https://www.sanapp.info/Imagenes/prueba.gif" class="loading" alt="San andres"/>`}
      />

      { toBack === 'catalogue' &&
        <Link style={{ textDecoration: 'none'}} className="categoryBack" to={{ pathname:'/catalogue', state: {fetch1: Math.floor((Math.random() * 10000) + 1)}}}>
            <IonImg
            src={BACK}
          />
        </Link>
      } 
      { toBack !== 'category' &&
        <Link style={{ textDecoration: 'none'}} className="categoryBack" to={{ pathname:'/catalogue', state: {fetch1: Math.floor((Math.random() * 10000) + 1)}}}>
            <IonImg
            src={BACK}
          />
        </Link>
      } 

      <div className="">
        <CardVoucher
          data={data}
          save={ (obj: any) => save(obj)}
          setRender={setRender}
          render={render}
          setToast={setToast}
          setMensaje={setMensaje}
          showSave={showSave}
        />
      </div>

      </IonContent>
    </IonPage>
  );
    
}

export default Voucher;
