import { 
  IonContent,
  IonPage,
  IonLoading,
  IonImg,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';

import React, { useState, useEffect } from 'react';

import './MyOrder.css'

import { BACK, DESDERECHA, DESABAJO } from '../../const/imgs';

import { Link } from 'react-router-dom';
import { getAllResumeOrder, getComplete } from '../../api/pedido/pedido';
import { completeCodigo, spliceTxt, getStatus, TYPE } from '../../const/functions';

import dayjs from 'dayjs'
import NumberFormat from 'react-number-format';

const Profile: React.FC<any> = (props) => {
  
  const [showLoading, setShowLoading] = useState(false);
  const [render, setRender] = useState(false);
  const [data, setData] = useState<any>([]);

  const [useFetch, setUseFetch] = useState('');
  const propFetch = (props.location ? props.location.state ? props.location.state.fetch5 : null : useFetch)

  if(propFetch !== useFetch && propFetch)
    setUseFetch(propFetch)
  
  useEffect(() => {
    fetchData()
  }, [useFetch])

  const fetchData = async () => {
      
    setShowLoading(true);
    
    try {
      const data = await getAllResumeOrder('1');
      let newData: any[] = data.data//[]
      /*
      data.data.forEach((element: any) => {
        let t = JSON.stringify(element);
        let temp = {...JSON.parse(t)}

        temp.promisedDeliveryDate = dayjs(temp.promisedDeliveryDate).add(-5, 'h').format('DD-MM-YYYY HH:mm')
        newData.push(temp)
      });
      */
      setData(newData)
      setShowLoading(false);
    } catch (error) {
      setShowLoading(false); 
    }
    
  };

  const fetchDetail = async (obj: any) => {
      
    obj.open = !obj.open 
    if(obj.orderDetail){
      return
    }

    setShowLoading(true);
    
    try {
      const data = await getComplete(obj.id);
      obj.orderDetail = data.data
      setShowLoading(false);
    } catch (error) {
      setShowLoading(false); 
    }
    
  };
  
  useEffect(() => {
    fetchData()
  }, [])

  const setOpen = (obj: any, i: number) => {
    fetchDetail(obj)
    setRender(!render)
  }
  
  return (
    <IonPage>
      <IonContent className="ion-padding">
      <IonLoading
        isOpen={showLoading}
        onDidDismiss={() => setShowLoading(false)}
        spinner={null}
        message={`<img src="https://www.sanapp.info/Imagenes/prueba.gif" class="loading" alt="San andres"/>`}
      />      
      
      <Link style={{ textDecoration: 'none'}} className="categoryBack" to={'/account'}>
          <IonImg
          src={BACK}
        />
      </Link> 

      <div className="registerContent">
        <div className="registerContent2">
          <div className="catalogueHeader_" >
            <div  className="catalogueBuscar">              
              <div className="ion-text-center fontmilkshake catalogueTxt24">
                Mis Ordenes
              </div>
            </div>
          </div>
        </div>
      </div>
            
      <br/><br/>

      {
        data.map((order: any, ind: number) => (
          <div className='profileBox ' key={ind}>
                  <IonGrid >
                    <IonRow className='MyOrderRow lineHe' onClick={ () => setOpen(order, ind) }>
                      <IonCol size={'10'}>
                        Orden #{completeCodigo(''+order.codigo)}
                      </IonCol>
                      <IonCol size={'2'}>
                        <IonImg
                          className={'supportIcon'}
                          src={order.open ? DESABAJO : DESDERECHA}
                        />
                      </IonCol>
                    </IonRow>

                      {order.open &&
                        <div className='myOrderMargin8'>
                          {(order.orderDetail || []).map((item: any, i: number) => (
                            <IonRow className='MyOrderRow' key={(ind+1*10)*(i+100)}>
                              <IonCol size={'10'} className='MyOrderRowProduct'>
                                { spliceTxt(item.idProduct ? item.product.name : item.promotion.name, 80) + ' || '
                                + spliceTxt(item.idProduct ? item.presentation.detail : '', 40)}
                              </IonCol>
                              <IonCol size={'2'} className='MyOrderRowProduct ion-text-right'>
                                {item.quantity}
                              </IonCol>
                            </IonRow>
                          ))}
                        </div>
                      }
                      {order.open &&
                       <div className='myOrderMargin8'>
                          <IonRow className='MyOrderRow'>
                            <IonCol size={'2'} className='MyOrderRowProduct'>
                              Fecha
                            </IonCol>
                            <IonCol size={'10'} className='MyOrderRowProduct ion-text-right'>
                            {dayjs(order.promisedDeliveryDate).add(-2, 'h').format('DD-MM-YYYY HH:mm')}
                            </IonCol>
                          </IonRow>
                        </div>
                      }
                      {order.open && order.discountAmount > 0 &&
                       <div className='myOrderMargin8'>
                          <IonRow className='MyOrderRow colorRed'>
                            <IonCol size={'5'} className='MyOrderRowProduct '>
                              Ahorro
                            </IonCol>
                            <IonCol size={'7'} className='MyOrderRowProduct ion-text-right'>
                              <NumberFormat
                                prefix=" $ "
                                thousandSeparator="."
                                decimalSeparator=","
                                value={order.discountAmount}
                                displayType={'text'}
                                decimalScale={0}
                              />
                            </IonCol>
                          </IonRow>
                        </div>
                      }
                      {order.open &&
                        <div className='myOrderMargin8'>
                          <IonRow className='MyOrderRow'>
                            <IonCol size={'5'} className='MyOrderRowProduct' style={{ color: order.idStatus === TYPE.ALISTADO || order.idStatus === TYPE.ENTREGADO ? '#7BED8D' : '#E66E5A'}}>
                              {spliceTxt( ''+getStatus(order.idStatus), 15 )}
                            </IonCol>
                            <IonCol size={'7'} className='MyOrderRowProduct ion-text-right'>
                              Total: 
                              <NumberFormat
                                prefix=" $ "
                                thousandSeparator="."
                                decimalSeparator=","
                                value={order.totalAmount - order.discountAmount}
                                displayType={'text'}
                                decimalScale={0}
                              />
                            </IonCol>
                          </IonRow>
                        </div>
                      }
                      
                  </IonGrid>
                </div>

          )
        )
      }
          

      </IonContent>
    </IonPage>
  );
    
  }

export default Profile;
