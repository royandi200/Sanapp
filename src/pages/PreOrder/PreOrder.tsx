import { 
  IonContent,
  IonPage,
  IonLoading,
  IonButton,
  IonImg,
  IonRow,
  IonGrid,
  IonCol
} from '@ionic/react';

import React, { useState, useEffect, useContext } from 'react';

import './PreOrder.css'

import { Tabs } from '../../components/Tabs/Tabs';

import { getUserPreOrder, needSupport } from '../../api/pedido/pedido';
import { CardOrderProduct } from '../../components/Cards/Card';
import { LOADINGCARRITO, NEXT } from '../../const/imgs';
import NumberFormat from 'react-number-format';
import { getLocalUser } from '../../api/user/user';
import { IVA } from '../../const/functions';
import InfoContext from '../../context/InfoContext';

const TOTALES = {
  subTotal: 0,
  ahorro: 0,
  retencion: 0,
  total: 0
}

const PreOrder: React.FC<any> = (props) => {
  const [showLoading, setShowLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [totales, setTotales] = useState<any>({...TOTALES});

  const [useFetch, setUseFetch] = useState('');
  const [curso, setCurso] = useState(0);

  const [petitionCount, setPetitionCount] = useState(true);

  const [userRetencion, setUserRetencion] = useState(0);

  const propFetch = (props.location ? props.location.state ? props.location.state.fetch4 : null : useFetch)

  const { petition, loadingCar }  = useContext<any>(InfoContext)

  useEffect(() => {
    setTimeout(() => {
      if(!loadingCar){
        fetchData() 
      }  
    }, 1000);
    return () => {
      if(propFetch !== useFetch && propFetch){
        setUseFetch(propFetch)
        setData([])
      }
    }
  }, [loadingCar])

  useEffect(() => {
    if(data === null && !showLoading && !loadingCar){
      console.info("2221consulto")
      fetchData();
    } 

    if(!(data || {}).orderItems){
      setTotales({
        total: 0,
        ahorro: 0,
        retencion: 0,
        subTotal: 0
      })    
      return
    }
    let total = 0,
    subTotal = 0,
    ahorro = 0,
    retencion = 0

    data.orderItems.forEach( (item:any) => {
      if(item.idProduct)
       subTotal += (item.presentation.price * item.quantity) 
      if(item.idPromotion){
        subTotal += ((item.promotion.price + item.promotion.discount)  * item.quantity)
        ahorro += item.promotion.discount * item.quantity
      }
    })
    if(userRetencion){
      retencion = (subTotal - ahorro) * IVA
    }
    total = subTotal - ahorro - retencion
    setTotales({
      total,
      ahorro,
      retencion,
      subTotal
    })
  }, [data, loadingCar, showLoading, userRetencion])

  const fetchData = async () => {
    console.info("consultoData")
    if(petition && petitionCount){
      setPetitionCount(false)
      setShowLoading(true);
      return  
    }
    if(petitionCount){
      setPetitionCount(false)
    }

    setShowLoading(true);
    const result = await getUserPreOrder();      
    const r = await needSupport() 
    const user = await getLocalUser()
    //console.info('user', user)
    setUserRetencion(user.facElec)
    //result.data.orderItems = result.data.orderItems.reverse()
    setCurso(r.data.length);  
    setData(result.data)
    setShowLoading(false);
  };
  
  const goDelivery = () => {
    if(data.orderItems ? data.orderItems.length === 0 : true)
      return
    props.history.push("/deliveryOrders", {fetch: Math.floor((Math.random() * 10000) + 1)})
  }

  return (
    <IonPage>
      {
        //loadingCar && <IonContent className="ion-padding"> <img style={{marginTop: "40vh", marginLeft: "43vw"}} src="https://www.sanapp.info/Imagenes/prueba.gif" className="loading" alt="San andres"/> </IonContent>
      }
      {//!loadingCar &&
        <IonContent className="ion-padding">
        
        <IonLoading
          isOpen={showLoading || loadingCar}
          onDidDismiss={() => setShowLoading(false)}
          spinner={null}
          message={`<img src="https://www.sanapp.info/Imagenes/prueba.gif" class="loading" alt="San andres"/>`}
        />

        <div className="registerContent">
          <div className="registerContent2">
            <div className="catalogueHeader" >
              <div  className="catalogueBuscar ion-text-center">
              {/* curso > 0 &&
                <div>
                  <div className="catalogueNumber ion-text-center">
                    {curso}
                  </div>
                  <div className="catalogueCurso" onClick={ () => props.history.push("/voucher", {back: 'preOrder', showSave: true}) }>
                    Pedido en curso
                    <IonImg
                      src={ICONPEDIDOCURSO}
                      className={'iconCurso'}
                      onClick={()=> {}}
                    />
                  </div>
                </div>
              */}
                <div className="preOrderCenter fontmilkshake">
                  Pedido
                </div>
              </div>
            </div>
          </div>
        </div>

      <div className="preOrderTop1">
          <div className="preOrderTop">
            <CardOrderProduct
              data={(data || {}).orderItems}
              setTotal={setTotales}
              total={totales}
              userRetencion={userRetencion ? true : false}
            />
          </div>
        </div>

      <div className="preOrderTotales">
        <div>
          <IonGrid>
            <IonRow>
            <IonCol size={'6'} className="ion-text-left preOrderSubTotal">
                Sub-Total
              </IonCol>
              <IonCol size={'6'} className="ion-text-right preOrderSubTotal">
                <NumberFormat
                  prefix="$"
                  thousandSeparator="."
                  decimalSeparator=","
                  value={totales.subTotal}
                  displayType={'text'}
                  decimalScale={0}
                />
              </IonCol>
              { totales.ahorro > 0 &&
                  <IonCol size={'6'} className="ion-text-left preOrderAhorro">
                    Ahorro
                  </IonCol>
              }
              { totales.ahorro > 0 &&
                  <IonCol size={'6'} className="ion-text-right preOrderAhorro">
                    <NumberFormat
                      prefix="$"
                      thousandSeparator="."
                      decimalSeparator=","
                      value={totales.ahorro}
                      displayType={'text'}
                      decimalScale={0}
                    />
                  </IonCol>
              }
              { totales.retencion > 0 &&
                  <IonCol size={'6'} className="ion-text-left preOrderAhorro">
                    Retención
                  </IonCol>
              }
              { totales.retencion > 0 &&
                  <IonCol size={'6'} className="ion-text-right preOrderAhorro">
                    <NumberFormat
                      prefix="$"
                      thousandSeparator="."
                      decimalSeparator=","
                      value={totales.retencion}
                      displayType={'text'}
                      decimalScale={0}
                    />
                  </IonCol>
              }
              <IonCol size={'6'} className="ion-text-left preOrderTotal">
                Total
              </IonCol>
              <IonCol size={'6'} className="ion-text-right preOrderTotal">
                <NumberFormat
                  prefix="$"
                  thousandSeparator="."
                  decimalSeparator=","
                  value={totales.total}
                  displayType={'text'}
                  decimalScale={0}
                />
              </IonCol>
            </IonRow>
          </IonGrid>

          <IonButton className='preOrderToOrder'  onClick={ () => goDelivery() }>
            <IonImg className="icon02" src={NEXT} slot="start"/>
            Realizar Pedido
          </IonButton>
        </div>
      </div>
        
        <Tabs selected={"4"}/>
        
        </IonContent>
      }
    </IonPage>
  );
    
  }


export default PreOrder;
