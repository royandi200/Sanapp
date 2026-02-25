import { 
  IonContent,
  IonPage,
  IonImg,
  IonLoading,
  IonGrid,
  IonRow,
  IonCol,
  IonModal
} from '@ionic/react';

import React, { useState, useEffect } from 'react';

import './FastOrder.css'

import {
  ICONLASTORDER,
  ICONVALIDARPEDIDO,
  CONFIRMAR,
  NEGAR
} from '../../const/imgs'
import { CardFastOrder } from '../../components/Cards/Card';
import { getMyFastProduct } from '../../api/fastProduct/fastProduct';
import { Tabs } from '../../components/Tabs/Tabs';
import { duplicateOrder } from '../../api/pedido/pedido';
import { Toast } from '../../components/Alert/Alert';
import { getCanLastOrder } from '../../api/user/user';

let canLastOrder = false

const FastOrder: React.FC<any> = (props) => {
  
  const [showLoading, setShowLoading] = useState(true);
  const [render, setRender] = useState(false);

  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState(false);
  const [mensaje, setMensaje] = useState('');
    
  const [data, setData] = useState<any>(null);

  const [useFetch, setUseFetch] = useState('');
  
  const propFetch = (props.location ? props.location.state ? props.location.state.fetch3 : null : useFetch)

  if(propFetch !== useFetch && propFetch)
    setUseFetch(propFetch)
  
  useEffect(() => {
    fetchData();
  }, [useFetch])
  
  const Save = () => {
    
    setShowLoading(true);
    
    const fetchData = async () => {
      try {
        await duplicateOrder();
        setMensaje('Se ha duplicado el último pedido')
        setShowLoading(false);
        setToast(true)  
        props.history.push("/preOrder", { fetch4: Math.floor((Math.random() * 10000) + 1)})
        //props.history.push("/preOrder", {fetch: }) 
      } catch (error) {
        setMensaje('Ups! error en la petición')
        setShowLoading(false);
        setToast(true)  
      }
      
    };
  
    fetchData();

  }

  const modalResp = (resp: number) => {
    if(resp){
      Save()
      setModal(false)
    } else {
      setModal(false)
    }
  }

  const fetchData = async () => {
    setShowLoading(true);
    const result = await getMyFastProduct();
    const resCanLastOrder = await getCanLastOrder();
    
    canLastOrder = resCanLastOrder.data.data
    setData(result.data)
    setShowLoading(false);
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
      
      <IonModal isOpen={modal}>
          <div>
            <IonImg
              src={ICONVALIDARPEDIDO}
              className={'iconValidar'}
            />
            <br/><br/><br/>
            <div className="txtDuplicar ion-text-center">
              ¿ Desea duplicar el último pedido ?
            </div>
            <br/><br/><br/>
            <div>
              <IonImg
                src={NEGAR}
                className={'iconNegar'}
                onClick={ () => modalResp(0) }
              />
              <IonImg
                src={CONFIRMAR}
                className={'iconConfirmar'}
                onClick={ () => modalResp(1) }
              />
            </div>
          
          </div>
          
      </IonModal>
      
    
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
      
      <div className="registerContent">
        <div className="registerContent2">
          <div className="" >
            <div  className="catalogueBuscar">
              <div className="">
              <IonGrid>
                <IonRow>
                  
                  <IonCol size={'2'}/>
                  <IonCol size={'8'} className="ion-text-center fontmilkshake FastOrderTxt24">
                    Pedido Rápido
                  </IonCol>
                </IonRow>
              </IonGrid>
              { canLastOrder &&
                <IonImg
                  src={ICONLASTORDER}
                  className={'iconLast'}
                  onClick={()=> {setModal(true)}}
                />
              }
              </div>
            </div>
          </div>
          
        </div>
      </div>

        <CardFastOrder
          data={(data || [])}
          render={render}
          setRender={setRender}
        />

      <Tabs selected={"3"}/>
      
      </IonContent>
    </IonPage>
  );
    
}

export default FastOrder;
