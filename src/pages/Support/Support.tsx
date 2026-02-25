import { 
  IonContent,
  IonPage,
  IonLoading,
  IonImg,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';

import React, { useState } from 'react';

import './Support.css'

import { Tabs } from '../../components/Tabs/Tabs';
import { DESABAJO, DESDERECHA, BACK } from '../../const/imgs';
import { Link } from 'react-router-dom';
import { getUsuDetail, changeUser } from '../../api/user/user';

const initialState = [
  {
    txt: 'Uso de la aplicación',
    open: false,
    data: [{
      txt: 'Compra de un Producto',
      type: 1
    },{
      txt: 'Compra de una promo',
      type: 2
    },{
      txt: 'Validación de documentos',
      type: 3
    },{
      txt: 'Creación de tiendas',
      type: 4
    }]
  },{
    txt: 'Pedidos realizados'
  },{
    txt: 'Solicitudes'
  }
]
const initialFetch = false
const Support: React.FC<any> = (props) => {
  
  const [showLoading, setShowLoading] = useState(false);
  const [data, setData] = useState<any>(initialState);
  const [render, setRender] = useState(false);

  const [docs, setDocs] = useState(0);
  
  //const toBack = (props.location.state ? props.location.state.back ? props.location.state.back : '/catalogue' : '/catalogue')

  const [fetch, setFetch] = useState(initialFetch);

  const fetchData = async () => {
      getUsuDetail().then( (datosUser: any) => {
        changeUser('docs', datosUser.data.docs)
        setDocs(datosUser.data.docs)
        setFetch(true)
        setShowLoading(false);
    });
    
  };

  if(!fetch){
     fetchData()
  }

  const setPreData = (i: number) => {
    data[i].open = !data[i].open
    setData(data)
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
      
      <Link style={{ textDecoration: 'none'}} className="categoryBack" to={{ pathname: docs !== 3 ? '/document' : 'catalogue', state: {fetch1: Math.floor((Math.random() * 10000) + 1)}}}>
          <IonImg
          src={BACK}
        />
      </Link>
      
      <div className="registerContent">
        <div className="registerContent2">
          <div className="catalogueHeader_" >
            <div  className="catalogueBuscar">              
              <div className="ion-text-center fontmilkshake catalogueTxt24">
                Soporte
              </div>
            </div>
          </div>
        </div>
      </div>
            
      <br/><br/>

      <div className=''>
        <IonGrid>
          { data.map((element: any, index: number) => 
          <div className='supportBox' key={ index}>
              <IonRow
                className='accountBox'
                onClick={() => 
                  element.txt !== 'Pedidos realizados' && element.txt !== 'Solicitudes' ? setPreData(index) : element.txt !== 'Solicitudes' ? props.history.push("/supportTransaction", {
                    type: (element || {}).type,
                    titulo: (element || {}).txt,
                    fetch7: Math.floor((Math.random() * 10000) + 1)
                  }) : 
                    props.history.push("/supportTransaction", {
                      type: (element || {}).type,
                      onlyShow: true,
                      titulo: (element || {}).txt,
                      fetch7: Math.floor((Math.random() * 10000) + 1)
                    })
                } >
                <IonCol size={'1'}>
                </IonCol>
                <IonCol size={'9'} className='accountTxt1' >
                  {element.txt}
                </IonCol>
                <IonCol size={'2'} >
                  <IonImg
                    className={'supportIcon'}
                    src={element.open ? DESABAJO : DESDERECHA}
                  />
                </IonCol>
              </IonRow>
              {
                element.open &&
                  element.data.map((elementData: any, index2: number) => 
                    <IonRow 
                      className='accountBox'
                      onClick={() => props.history.push("/supportUse", {
                          type: (elementData || {}).type,
                          titulo: (elementData || {}).txt,
                          fetch6: Math.floor((Math.random() * 10000) + 1)
                        }
                      )}
                      key={((index2+1)*100)}
                    >
                      <IonCol size={'2'}/>
                      <IonCol size={'8'} className='accountTxt1' >
                        {elementData.txt}
                      </IonCol>
                      <IonCol size={'2'} >
                        <IonImg
                          className={'supportIcon'}
                          src={DESDERECHA}
                        />
                      </IonCol>
                    </IonRow>
                  )
              }
            </div>
          )
            
          }
        </IonGrid>

      </div>

      <Tabs selected={"11"}/>
      
      </IonContent>
    </IonPage>
  );
    
  }


export default Support;
