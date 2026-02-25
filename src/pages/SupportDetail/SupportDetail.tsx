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

import './SupportDetail.css'

import { Tabs } from '../../components/Tabs/Tabs';
import { BACK } from '../../const/imgs';
import { getTypeSupport } from '../../api/type/type';
import { Link } from 'react-router-dom';


const Support: React.FC<any> = (props) => {
  
  const [showLoading, setShowLoading] = useState(true);
  const [data, setData] = useState<any>([]);

  const fetchData = async () => {
    const result = await getTypeSupport(props.location.state.type);
    setData(result.data)
    setShowLoading(false);
  };
  

  if(data.length === 0){
    fetchData()
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
            <IonImg
              className='supUseImg'
              src={ele.img}
            />
            <br/>
            <div className='accountBox'>
              {ele.txt}
            </div>
          </div>
          
          
        )
      }
        <br/><br/><br/><br/><br/>
      <Tabs selected={"6"}/>
      
      </IonContent>
    </IonPage>
  );
    
  }


export default Support;
