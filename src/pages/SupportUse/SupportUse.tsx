import { 
  IonContent,
  IonPage,
  IonLoading,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';

import React, { useState, useEffect, } from 'react';

import './SupportUse.css'

import { BACK, PULGARARRIBA, PULGARABAJO, PULGARARRIBAVERDE} from '../../const/imgs';
import { getTypeSupport } from '../../api/type/type';
import { Link } from 'react-router-dom';
import { TYPE } from '../../const/functions';


const Support: React.FC<any> = (props) => {
  
  const [showLoading, setShowLoading] = useState(true);
  const [verde, setVerder] = useState(false);
  
  const [data, setData] = useState<any>([]);

  const [useFetch, setUseFetch] = useState('');
  const propFetch = (props.location ? props.location.state ? props.location.state.fetch6 : null : useFetch)

  if(propFetch !== useFetch && propFetch)
    setUseFetch(propFetch)
  
  useEffect(() => {
    const fetchData = async () => {
      setShowLoading(true);
      const result = await getTypeSupport(props.location.state.type); 
      setVerder(false)
      setData(result.data)
      setShowLoading(false);
    };
    fetchData()
  }, [useFetch])
  /*
  const fetchData = async () => {
    setShowLoading(true);
    const result = await getTypeSupport(props.location.state.type); 
    setVerder(false)
    setData(result.data)
    setShowLoading(false);
  };
  */
  const getType = () =>{
    let type
    switch (props.location.state.type) {
      case 1:
        type = TYPE.COMPRAPRODUCTO
        break;
      case 2:
        type = TYPE.COMPRAPROMO
      break;
      case 3:
        type = TYPE.VALIDARDOCUMENTO
      break;
      case 4:
        type = TYPE.CREARTIENDA
      break;
    
      default:
        break;
    }
    
    return type
  }
  
  const titulo = props.location ? props.location.state ? props.location.state.titulo : '' : ''

  return (
    <IonPage>
      <IonContent className="ion-padding">
      <IonLoading
        isOpen={showLoading}
        onDidDismiss={() => setShowLoading(false)}
        spinner={null}
        message={`<img src="https://www.sanapp.info/Imagenes/prueba.gif" class="loading" alt="San andres"/>`}
      />

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
            
      {
        data.map((ele: any, i:number) => 
        
          <div key={i}>
            <br/>
            <td className='supUseBox' dangerouslySetInnerHTML={{__html: ele.txtPrincipal}} />
            <IonImg
              className='supUseImg'
              src={ele.img}
            />
            <br/>
            <td className='supUseBox' dangerouslySetInnerHTML={{__html: ele.txt}} />
            
          </div>
          
          
        )
      }

<br/>
      <IonGrid >
      <IonRow className='center22'>
        <IonCol size={'4'}>
        </IonCol>
        <IonCol size={'2'} className='center22' >
          <IonImg
            src={verde ? PULGARARRIBAVERDE : PULGARARRIBA}
            className='iconPulgar'
            onClick={ () => setVerder(true)}
            />
        </IonCol>
        <IonCol size={'2'}>
        <IonImg
            src={PULGARABAJO}
            className='iconPulgar'
            onClick={() => props.history.push("/supportTransaction", {
              typeSup: getType(),
              only: true,
              titulo: 'Solicitud',
              fetch7: Math.floor((Math.random() * 10000) + 1)
            })}
          />
        </IonCol>
        <IonCol size={'4'}>
        </IonCol>
      </IonRow>
      </IonGrid>
      
      </IonContent>
    </IonPage>
  );
    
  }


export default Support;
