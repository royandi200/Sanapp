import { 
  IonContent,
  IonPage,
  IonLoading,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
  IonSlides,
  IonSlide,
  IonTextarea,
  IonButton,
  IonRippleEffect,
  IonModal
} from '@ionic/react';

import React, { useState, useEffect } from 'react';

import './SupportTransaction.css'

import { BACK, NEXT, ADJUNTO, DESABAJO, DESDERECHA, PULGARARRIBAVERDE, SOLCONFIRMADO } from '../../const/imgs';
import { Link } from 'react-router-dom';
import { getAllResumeOrder, getComplete } from '../../api/pedido/pedido';
import dayjs from 'dayjs';
import { spliceTxt, getStatus, completeCodigo, TYPE } from '../../const/functions';
import { InputSelect, takePicture } from '../../components/Inputs/Input';
import { insertModification, getAllOrderModification } from '../../api/orderModification/orderModification';
import { Toast } from '../../components/Alert/Alert';
import NumberFormat from 'react-number-format';
import { getCalendar } from '../../api/calendar/calendar';

const opc = [
  {
    value: 'fecha',
    txt: 'Fecha y hora'
  },
  {
    value: 'productos',
    txt: 'Productos'
  },
  {
    value: 'metodo',
    txt: 'Método de pago'
  },
  {
    value: 'soporte',
    txt: 'Soporte de pago'
  },
  {
    value: 'cancelar',
    txt: 'Cancelar'
  },
]

const slideOpts = {
  initialSlide: 0,
  speed: 400,
  slidesPerView: 3.2
};

const initialState = {
  idStore: '',
  paymentMethod: '',
  date: dayjs(),
  time: {txt:'', min:0, max:0}
}
const initialStateOnly = {
  support: '',
  comentario: 'Comentario...  '
}

const SupportTransaction: React.FC<any> = (props) => {

  const [days, setDays] = useState<any>([{}, {}, {}, {}, {}]);
  const [hours, setHours] = useState<any>([]);
  const [showLoading, setShowLoading] = useState(true);
  const [data, setData] = useState<any>([]);
  const [dataOnlyShow, setDataOnlyShow] = useState<any>(false);
  const [render, setRender] = useState(false);
  const [cambio, setCambio] = useState('fecha');
  const [comentario, setComentario] = useState('');
  const [useFetch, setUseFetch] = useState('');
  const propFetch = (props.location ? props.location.state ? props.location.state.fetch7 : null : useFetch)
  const [mensaje, setMensaje] = useState('');
  const [toast, setToast] = useState(false);
  const [formData, setFormData] = useState(initialState)
  const [formOnly, setFormOnly] = useState(initialStateOnly)
  const [modal, setModal] = useState(false);
  const [idSolicitud, setIdSolicitud] =useState('');
  const only = (props.location ? props.location.state ? props.location.state.only : true : false)
  const onlyShow = (props.location ? props.location.state ? props.location.state.onlyShow : true : false)
  const typeSup = (props.location ? props.location.state ? props.location.state.typeSup : '' : '')
  const titulo = props.location ? props.location.state ? props.location.state.titulo : '' : ''

  if(propFetch !== useFetch && propFetch){
    setUseFetch(propFetch)
  }

  useEffect(() => {
    const fetchDays = async () => {
      const result = await getCalendar(false);
      result.data.map(
        (calendar: any) => (calendar.value = dayjs(calendar.value))
      );
      setDays(result.data);
    };
    fetchDays();
  }, []);

  useEffect(() => {
    if(onlyShow)
      fetchDataOnlyShow()
    else
      fetchData()
  }, [onlyShow, useFetch])

  const getImg = (obj: any, number:number = 0) =>{
    takePicture().then( (img) => {
      obj.support = img
      if(number === 1)
        setFormOnly({
          ...formOnly,
          support: ''+img
        })
      setRender(!render)
      setMensaje('El adjunto se ha guardado')
      setToast(true)
    })
}

  const fetchData = async () => {
    try {
      
      setShowLoading(true);
      const data = await getAllResumeOrder('2');
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

  const fetchDataOnlyShow = async () => {
    try {      
      setShowLoading(true);
      const data = await getAllOrderModification();
      setDataOnlyShow(data.data)
      setShowLoading(false);
    } catch (error) {
      setShowLoading(false); 
    }
  };

  const fetchDetail = async (obj: any) => {
    
    data.forEach((element: any) => {
      if(element.id === obj.id)
        return
      element.open = false
    });
    
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

  const save = async (obj: any) => {
    
    setShowLoading(true);
    
    try {
      let values: any = {} 
      if(!only)
        switch (cambio) {
          case 'fecha':
            values = {
              idOrder: obj.id,
              deliveryWindow: formData.date.format("YYYY-MM-DD") + ' ; ' + formData.time.txt,
              user: true,
              idStatus: TYPE.CREADO,
              commentary: comentario,
              support: obj.support,
              idType: TYPE.CAMBIARFECHAYHORA
            }
          break;
          case 'productos':
            values = {
              idOrder: obj.id,
              user: true,
              idStatus: TYPE.CREADO,
              commentary: comentario,
              support: obj.support,
              detail: obj.detail,
              idType: TYPE.CAMBIARPRODUCTOS
            }
          break;
          case 'metodo':
            values = {
              idOrder: obj.id,
              user: true,
              idStatus: TYPE.CREADO,
              idPaymentMethod: obj.idPaymentMethod === TYPE.CONTRAENTREGA ? TYPE.CONSIGNACION : TYPE.CONTRAENTREGA,
              commentary: comentario,
              support: obj.support,
              idType: TYPE.CAMBIARMETODODEPAGO
            }
          break;
          case 'soporte':
            values = {
              idOrder: obj.id,
              user: true,
              idStatus: TYPE.CREADO,
              support: obj.support,
              commentary: comentario,
              idType: TYPE.CAMBIARSOPORTEDEPAGO
            }
          break;
          
          case 'cancelar':
            values = {
              idOrder: obj.id,
              user: true,
              idStatus: TYPE.CREADO,
              support: obj.support,
              commentary: comentario,
              idType: TYPE.CAMBIARCANCELADO
            }
          break;
            
            
          default:
            
          break;
        }
      else 
      values = {
        idOrder: '',
        user: true,
        idStatus: TYPE.CREADO,
        support: formOnly.support,
        commentary: comentario,
        idType: typeSup
      }
      
      if(comentario === ''){
        setMensaje('Ingrese un comentario')
        setToast(true)
        setShowLoading(false);
        return
      }
      const data = await insertModification(values);
      setIdSolicitud(completeCodigo(''+data.data.codigo))
      setModal(true)
      //obj.orderDetail = data.data
      obj.open = false
      setFormData(initialState)
      setFormOnly(initialStateOnly)
      setComentario('')
      setCambio('fecha')
      setShowLoading(false);
    } catch (error) {
      setShowLoading(false); 
    }
    
  };

  const setOpen = (obj: any, i: number) => {
    
    fetchDetail(obj)
    setRender(!render)
  }

  const setOpenOnlyShow = (obj: any, i: number) => {
    obj.open = !obj.open
    setRender(!render)
  }

  const addProduct = (orderIndex: number, item: any) => {
    if(cambio !== 'productos')
      return
    let i = -1
    if(data[orderIndex].detail){
      i = data[orderIndex].detail.findIndex( (det: any) => det.id === item.id)
    }
    
    if(i>-1)
      return
    const t = JSON.stringify(item);
    const newItem = JSON.parse(t)
    let name = '-'
    if(item.idProduct){
      name = spliceTxt(item.product.name, 20) + ' ' + spliceTxt(item.idProduct ? item.presentation.detail : '', 10)
    } else {
      name = spliceTxt(item.promotion.name, 28)
    }
    
    data[orderIndex].detail ?
      data[orderIndex].detail.push({
          ...newItem,
          idOrderDetail: newItem.id,
          name
        }) :
          data[orderIndex].detail = [{
            ...newItem,
            idOrderDetail: newItem.id,
            name
          }]

    setRender(!render)
  }

  const quantity = (item: any, type: number) => {
    if(type === 1){
      item.quantity += 1
    } else {
      if(item.quantity > 0)
        item.quantity -= 1
    }
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

      <IonModal isOpen={modal} onDidDismiss={ () => {setModal(false); setIdSolicitud('')} }>
        <IonImg
          className="categoryBack"
          src={BACK}
          onClick={ () => {setModal(false); setIdSolicitud('')} }
        />
        <div>
          <IonImg
            src={SOLCONFIRMADO}
            className={'iconValidar'}
          />
          <br/><br/><br/>
          <div className="txtCon1 ion-text-center">
            SOLICITUD #{idSolicitud}
          </div>
          <br/>
          <div className="txtCon2 ion-text-center">
            CONFIRMADA
          </div>
          <br/>
          <div 
            onClick={ () => {setModal(false); setIdSolicitud('') ; props.history.push("/catalogue")} }
          >
            <IonImg
              className={'iconUpp'}
              src={PULGARARRIBAVERDE}
            />
            <div className='txtCon3 ion-text-center'>
              Volver
            </div>
            
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

      <Link style={{ textDecoration: 'none'}} className="categoryBack" to={'/support'} >
          <IonImg
          src={BACK}
        />
      </Link> 
      
      <div className="registerContent">
        <div className="registerContent2">
          <div className="catalogueHeader_" >
            <div  className="catalogueBuscar">              
              <div className="ion-text-center fontmilkshake catalogueTxt24">
                {titulo}
              </div>
            </div>
          </div>
        </div>
      </div>
       <br/><br/>
      { !only && !onlyShow &&
        data.map((order: any, ind: number) => (
          <div className='' key={ind}>
            <IonGrid >
              <div className='profileBox'>
                <IonRow className='MyOrderRow  ' onClick={ () => setOpen(order, ind) }>
                  
                  <IonCol size={'10'} className='accountTxt1'>
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
                  <div className="myOrderMargin8">
                    {
                      (order.orderDetail || []).map((item: any, i: number) => (
                        <IonRow className='MyOrderRow ' key={(ind+1*10)*(i+100)} onClick={() => { addProduct(ind, item) }}>
                          <IonCol size={'10'} className='MyOrderRowProduct'>
                            {spliceTxt(item.idProduct ? item.product.name : item.promotion.name, 20) + ' '
                            + spliceTxt(item.idProduct ? item.presentation.detail : ' ', 10)}
                          </IonCol>
                          <IonCol size={'2'} className='MyOrderRowProduct ion-text-right'>
                            {item.quantity}
                          </IonCol>
                        </IonRow>
                      ))
                    }
                  </div>
                }
                {order.open &&
                
                  <div className="myOrderMargin8">
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
                  <div className="myOrderMargin8">
                    <IonRow className='MyOrderRow colorRed'>
                      <IonCol size={'5'} className='MyOrderRowProduct'>
                        Ahorro
                      </IonCol>
                      <IonCol size={'7'} className='MyOrderRowProduct ion-text-right'>
                        <NumberFormat
                          prefix="$"
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
                  <div className="myOrderMargin81">
                    <IonRow className='MyOrderRow'>
                      <IonCol size={'5'} className='MyOrderRowProduct'>
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
              </div>

              {
                order.open &&
                <div>
                  <div className='txtSelecSuppo'>
                    Seleccione el cambio que desea realizar
                  </div>
                  <br/>
                </div>
              }

              {
                order.open &&
                <InputSelect
                  txt="Cambio"
                  onInput={(value: string) => setCambio(value)}
                  data={opc}
                  positionTxt={"floating"}
                  value={cambio}
                  propId={'value'}
                  propTxt={'txt'}
                  className={' '}
                />
              }

{
                order.open && cambio === 'fecha' &&
                <div>
                            
                  <IonRow className="deliveryOrderMethod deliveryORderTop2">
                    Fecha
                  </IonRow>

                  <IonRow className="deliveryORderTop2">
                    <IonCol className="ion-text-center paddingTop " size="12">
                      <IonSlides pager={false} className="" options={slideOpts}>
                        {
                          days.map( (day:any, i:number) => (
                            <IonSlide key={i} className={""}>
                              <div
                                key={i}
                                className={ formData.date === day.value ? "deliveryOrderDays deliveryOrderSelected" : "deliveryOrderDays "}
                                onClick={() => {                    
                                  setFormData({
                                    ...formData,
                                    date: day.value,
                                    time: { txt: "", min: 0, max: 0 },
                                  });
                                  setHours(day.time);    
                                }}

                                
                              >
                                {day.txt}
                              </div>
                            </IonSlide>
                          ))
                          
                        }
                      </IonSlides> 
                    </IonCol>
                  </IonRow>

                  <IonRow className="deliveryOrderMethod deliveryORderTop2">
                    Hora
                  </IonRow>

                  <IonRow className="deliveryORderTop2">
                  <IonCol className="ion-text-center paddingTop " size="12">
                  
                    <IonSlides pager={false} className="" options={slideOpts}>
                        {hours.map( (time:any, i:number) => (
                          <IonSlide key={i} className={""}>
                            <div
                              key={i}
                              className={ formData.time === time ? "deliveryOrderDays deliveryOrderSelected" : "deliveryOrderDays  "}
                              onClick={() => setFormData({
                                ...formData,
                                time: time
                              })}
                            >
                              {time.txt}
                            </div>
                          </IonSlide>
                        ))}
                    </IonSlides> 
                    
                    </IonCol>
                  </IonRow>

                </div>
              }

              {
                order.open && cambio === 'productos' &&
                <div>
                            
                  <IonRow className="deliveryOrderMethod deliveryORderTop2">
                    Productos a cambiar
                  </IonRow>
                  
                  { (order.detail || []).map((item: any, ii: number) => 
                    
                    <IonRow className="deliveryelementOrderMethod deliveryORderTop2" key={ii}>

                      <IonCol className="ion-text-center paddingTop " size="6">
                      {spliceTxt(item.idProduct ? item.product.name : item.promotion.name, 20) + ' '
                        + spliceTxt(item.idProduct ? item.presentation.detail : '', 10)}
                      </IonCol>

                      <IonCol className="ion-text-center paddingTop " size="2">
                      <div className="cardPromotionCircle supMas ">
                        <div className="ion-activatable ripple-parent " onClick={() => {quantity(item, 0)}}>
                          <IonRippleEffect className="rippleCircle "></IonRippleEffect>
                          -
                        </div>
                      </div>
                      </IonCol>
                      <IonCol className=" paddingTop supcenter ion-text-center" size="2">
                        {item.quantity || 0}
                      </IonCol>
                      <IonCol className="ion-text-center paddingTop " size="2">
                      <div className="cardPromotionCircle supMas ">
                        <div className="ion-activatable ripple-parent " onClick={() => {quantity(item, 1)}}>
                          <IonRippleEffect className="rippleCircle "></IonRippleEffect>
                          +
                        </div>
                      </div>
                      </IonCol>
                      
                    </IonRow>
                    )
                  }

                  <div>

                  </div>

                </div>
              }

              {
                order.open &&
                <div>
                  { cambio === 'productos' &&
                    <div>
                      <div className='profileBox padding16 ion-text-center txtCon3'>
                        Vecino presione encima del nombre de los productos que desea cambiar en su orden.  
                        <br/><br/>
                        <div className='ion-text-left colorRed'>
                          Para eliminar cantidad = 0
                        </div>
                      </div>
                    </div>
                  }
                  <br/>
                  <div>
                    <IonTextarea
                      placeholder={'Comentarios...'}
                      value={comentario}
                      onIonChange={e => setComentario(e.detail.value!)}
                      className='profileBox'
                      rows={5}
                    />
                  </div>
                  
                  <div className='ion-text-end'>
                    <IonImg className="supAdj" src={ADJUNTO} onClick={ () => getImg(order)}/>
                  </div>
                  
                  <br/><br/>

                  <div className='ion-text-center padding16 txtCon3'>
                    Vecino un asesor de servicio se comunicara lo mas pronto posible con el fin de ajustar su pedido según su solicitud!
                  </div>
                </div>
              }

            </IonGrid>
            {
              order.open &&
                <IonButton className='loginMarginTop21 loginBtn'  onClick={ () => save(order)}>
                  <IonImg className="icon02" src={NEXT} slot="start"/>
                  GUARDAR
                </IonButton>
            }

          </div>
        ))
      }

      {only && !onlyShow &&
      <div>
        <div>
          <IonTextarea
            placeholder={'Comentarios...'}
            value={comentario}
            onIonChange={e => setComentario(e.detail.value!)}
            className='profileBox'
            rows={5}
          />
        </div>
        
        <div className='ion-text-end'>
          <IonImg className="supAdj" src={ADJUNTO} onClick={ () => getImg(formOnly, 1)}/>
        </div>

        <div className='profileBox ion-text-center supTraTop1 padding16 txtCon3'>
         Vecino un asesor de servicio se comunicara lo mas pronto posible con el fin de ajustar su pedido según su solicitud!
        </div>

        <IonButton className='loginMarginTop21 loginBtn supTraTop1'  onClick={ () => save(formOnly)}>
          <IonImg className="icon02" src={NEXT} slot="start"/>
          GUARDAR
        </IonButton>
        
      </div>
      }

      {
        onlyShow &&
        <div>
          {(dataOnlyShow || []).map((element: any, ind: number) => 
            <div className='' key={ind}>
            <IonGrid >
              <div className='profileBox'>
                <IonRow className='MyOrderRow lineHe' onClick={ () => setOpenOnlyShow(element, ind) }>
                  <IonCol size={'1'}/>
                  <IonCol size={'9'}>
                    Solicitud # {completeCodigo(''+element.codigo)}
                  </IonCol>
                  <IonCol size={'2'}>
                  <IonImg
                      className={'supportIcon'}
                      src={element.open ? DESABAJO : DESDERECHA}
                    />
                  </IonCol>
                </IonRow>
                { element.open && 
                  <div className='myOrderMargin8'>
                    { element.idType === TYPE.CAMBIARCANCELADO &&
                    <div>
                      <IonRow >
                        <IonCol size={'4'} className='solicitudesTxt'>
                          Order #
                        </IonCol>
                        <IonCol size={'8'} className='solicitudesTxt'>
                          {completeCodigo(''+element.order.codigo)}
                        </IonCol>
                      </IonRow>
                      
                      <IonRow>
                        <IonCol size={'4'} className='solicitudesTxt'>
                          Tipo
                        </IonCol>
                        <IonCol size={'8'} className='solicitudesTxt'>
                          Cancelar
                        </IonCol>
                      </IonRow>
                      
<br/>
                      <IonRow>
                        <IonCol size={'12'} className='solicitudesTxt'>
                          Comentario
                        </IonCol>
                      </IonRow>

                      <IonRow>
                        <IonCol size={'12'} className='solicitudesTxt'>
                          {element.commentary}
                        </IonCol>
                      </IonRow>

                      <br/>
                      { element.answer &&
                        <div>
                          <IonRow>
                            <IonCol size={'12'} className='solicitudesTxtAnswer'>
                              Respuesta
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size={'12'} className='solicitudesTxtAnswer'>
                              {element.answer}
                            </IonCol>
                          </IonRow>
                        </div>
                      }
                      <br/>
                      
                      <IonRow>
                        <IonCol size={'12'} style={{ color: element.idStatus === TYPE.CREADO ? '#E66E5A' : '#7BED8D'}} >
                          {element.idStatus === TYPE.CREADO ? 'Pendiente' : 'Resuelto'}
                        </IonCol>
                      </IonRow>

                    </div>
                    }




                    { element.idType === TYPE.CAMBIARFECHAYHORA &&
                    <div>
                      <IonRow >
                        <IonCol size={'4'} className='solicitudesTxt'>
                          Order #
                        </IonCol>
                        <IonCol size={'8'} className='solicitudesTxt'>
                          {completeCodigo(''+element.order.codigo)}
                        </IonCol>
                      </IonRow>
                      
                      <IonRow>
                        <IonCol size={'4'} className='solicitudesTxt'>
                          Tipo
                        </IonCol>
                        <IonCol size={'8'} className='solicitudesTxt'>
                          Fecha y hora del pedido
                        </IonCol>
                      </IonRow>
                      
                      <IonRow>
                        <IonCol size={'4'} className='solicitudesTxt'>
                          Detalle
                        </IonCol>
                        <IonCol size={'8'} className='solicitudesTxt'>
                          cambio a {element.deliveryWindow}
                        </IonCol>
                      </IonRow>
<br/>
                      <IonRow>
                        <IonCol size={'12'} className='solicitudesTxt'>
                          Comentario
                        </IonCol>
                      </IonRow>

                      <IonRow>
                        <IonCol size={'12'} className='solicitudesTxt'>
                          {element.commentary}
                        </IonCol>
                      </IonRow>

                      <br/>
                      { element.answer &&
                        <div>
                          <IonRow>
                            <IonCol size={'12'} className='solicitudesTxtAnswer'>
                              Respuesta
                            </IonCol>
                          </IonRow>
                          <IonRow>
                            <IonCol size={'12'} className='solicitudesTxtAnswer'>
                              {element.answer}
                            </IonCol>
                          </IonRow>
                        </div>
                      }
                      <br/>
                      
                      <IonRow>
                        <IonCol size={'12'} style={{ color: element.idStatus === TYPE.CREADO ? '#E66E5A' : '#7BED8D'}} >
                          {element.idStatus === TYPE.CREADO ? 'Pendiente' : 'Resuelto'}
                        </IonCol>
                      </IonRow>

                    </div>
                    }

                    { element.idType === TYPE.CAMBIARPRODUCTOS &&
                      <div>
                        <IonRow>
                          <IonCol size={'4'} className='solicitudesTxt'>
                            Order #
                          </IonCol>
                          <IonCol size={'8'} className='solicitudesTxt'>
                            {completeCodigo(''+element.order.codigo)}
                          </IonCol>
                        </IonRow>
                        
                        <IonRow>
                          <IonCol size={'4'} className='solicitudesTxt'>
                            Tipo
                          </IonCol>
                          <IonCol size={'8'} className='solicitudesTxt'>
                            Cambio de productos
                          </IonCol>
                        </IonRow>
                        
                        <IonRow>
                          <IonCol size={'12'} className='solicitudesTxt'>
                            Detalle
                          </IonCol>
                        </IonRow>

                        {
                          element.orderModificationDetails.map((detail: any, i: number) => 
                          <IonRow key={i}>
                            <IonCol size={'10'} className='solicitudesTxt'>
                              {detail.name}
                            </IonCol>
                            <IonCol size={'2'} className='solicitudesTxt'>
                              {detail.quantity}
                            </IonCol>
                          </IonRow>
                          )
                        }
<br/>
                        <IonRow>
                          <IonCol size={'12'} className='solicitudesTxt'>
                            Comentario
                          </IonCol>
                        </IonRow>
                        
                        <IonRow>
                          <IonCol size={'12'} className='solicitudesTxt'>
                            {element.commentary}
                          </IonCol>
                        </IonRow>

                        <br/>
                        { element.answer &&
                          <div>
                            <IonRow>
                              <IonCol size={'12'} className='solicitudesTxtAnswer'>
                                Respuesta
                              </IonCol>
                            </IonRow>
                            <IonRow>
                              <IonCol size={'12'} className='solicitudesTxtAnswer'>
                                {element.answer}
                              </IonCol>
                            </IonRow>
                          </div>
                        }
                        <br/>

                        <IonRow>
                          <IonCol size={'12'} style={{ color: element.idStatus === TYPE.CREADO ? '#E66E5A' : '#7BED8D'}} >
                            {element.idStatus === TYPE.CREADO ? 'Pendiente' : 'Resuelto'}
                          </IonCol>
                        </IonRow>

                      </div>
                    }

                    { element.idType === TYPE.CAMBIARMETODODEPAGO &&
                      <div>
                        <IonRow>
                          <IonCol size={'4'} className='solicitudesTxt'>
                            Order #
                          </IonCol>
                          <IonCol size={'8'} className='solicitudesTxt'>
                            {completeCodigo(''+element.order.codigo)}
                          </IonCol>
                        </IonRow>
                        
                        <IonRow>
                          <IonCol size={'4'}  className='solicitudesTxt'>
                            Tipo
                          </IonCol>
                          <IonCol size={'8'} className='solicitudesTxt'>Método de pago
                          </IonCol>
                        </IonRow>
                        
                        <IonRow>
                          <IonCol size={'4'} className='solicitudesTxt'>
                            Detalle
                          </IonCol>
                          <IonCol size={'8'} className='solicitudesTxt'>
                            cambio a: {element.idPaymentMethod === TYPE.CONTRAENTREGA ? 'Contra entrega' : 'Consignación'}
                          </IonCol>
                        </IonRow>
<br/>
                        <IonRow>
                          <IonCol size={'12'} className='solicitudesTxt'>
                            Comentario
                          </IonCol>
                        </IonRow>

                        <IonRow>
                          <IonCol size={'12'} className='solicitudesTxt'>
                            {element.commentary}
                          </IonCol>
                        </IonRow>

                        <br/>
                        { element.answer &&
                          <div>
                            <IonRow>
                              <IonCol size={'12'} className='solicitudesTxtAnswer'>
                                Respuesta
                              </IonCol>
                            </IonRow>
                            <IonRow>
                              <IonCol size={'12'} className='solicitudesTxtAnswer'>
                                {element.answer}
                              </IonCol>
                            </IonRow>
                          </div>
                        }
                        <br/>
                        
                        <IonRow>
                          <IonCol size={'12'} style={{ color: element.idStatus === TYPE.CREADO ? '#E66E5A' : '#7BED8D'}} >
                            {element.idStatus === TYPE.CREADO ? 'Pendiente' : 'Resuelto'}
                          </IonCol>
                        </IonRow>

                      </div>
                    }

                    { (element.idType === TYPE.CAMBIARSOPORTEDEPAGO || element.idType === TYPE.COMPRAPRODUCTO || element.idType === TYPE.COMPRAPROMO
                      || element.idType === TYPE.CREARTIENDA || element.idType === TYPE.VALIDARDOCUMENTO) &&
                      <div>
                         { element.order &&
                          <IonRow>
                            <IonCol size={'4'} className='solicitudesTxt'>
                              Order #
                            </IonCol>
                            <IonCol size={'8'} className='solicitudesTxt'>
                              {completeCodigo(''+element.order.codigo)}
                            </IonCol>
                          </IonRow>
                        }
                        
                        <IonRow>
                          <IonCol size={'4'} className='solicitudesTxt'>
                            Tipo
                          </IonCol>
                          <IonCol size={'8'} className='solicitudesTxt'>
                            {getStatus(''+ element.idType)}
                          </IonCol>
                        </IonRow>
                        <br/>
                        <IonRow>
                          <IonCol size={'12'} className='solicitudesTxt'>
                            Comentario
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size={'12'} className='solicitudesTxt'>
                            {element.commentary}
                          </IonCol>
                        </IonRow>

                        <br/>
                        { element.answer &&
                          <div>
                            <IonRow>
                              <IonCol size={'12'} className='solicitudesTxtAnswer'>
                                Respuesta
                              </IonCol>
                            </IonRow>
                            <IonRow>
                              <IonCol size={'12'} className='solicitudesTxtAnswer'>
                                {element.answer}
                              </IonCol>
                            </IonRow>
                          </div>
                        }
                        <br/>
                        
                        <IonRow>
                          <IonCol size={'12'} style={{ color: element.idStatus === TYPE.CREADO ? '#E66E5A' : '#7BED8D'}} >
                            {element.idStatus === TYPE.CREADO ? 'Pendiente' : 'Resuelto'}
                          </IonCol>
                        </IonRow>

                      </div>
                    }
                    <br/>
                  </div>
                }
              </div>
            </IonGrid >
            
            </div>
          )
          }
        </div>
      }
      
      
      
      </IonContent>
    </IonPage>
  );
    
  }


export default SupportTransaction;
