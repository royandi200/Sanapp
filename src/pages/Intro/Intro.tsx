import { 
  IonContent,
  IonPage,
  IonSlides,
  IonSlide,
  IonImg,
  IonLoading
} from '@ionic/react';

import React, { useState } from 'react';

import './Intro.css'

import { 
  INTRO1,
  INTRO2,
  INTRO3,
  LOGO
} from '../../const/imgs'

import { putUsu, sessionUsu, changeUser } from '../../api/user/user';

const Intro: React.FC<any> = (props) => {
  
  const [showLoading, setShowLoading] = useState(false);

  const discard = () => {

    setShowLoading(true);

    const fetchData = async () => {
      
      await putUsu({
        intro: false,
        id: sessionUsu().id
      });

      changeUser('intro', 0).then( () => {
        props.history.push("/document") 
        setShowLoading(false);
      })
      
      
    };
  
    fetchData();

  }


  const slideOpts = {
    initialSlide: 0,
    speed: 500
  };


  return (
    <IonPage>
      <IonContent className="ion-padding">
      
      <IonLoading
        isOpen={showLoading}
        onDidDismiss={() => setShowLoading(false)}
        spinner={null}
        message={`<img src="https://www.sanapp.info/Imagenes/prueba.gif" class="loading" alt="San andres"/>`}
      />
      
      <div className="registerContent">
        <div className="registerContent2">
          <div className="introHeader" >
            <div style={{paddingTop: "3vh"}}></div>
            <IonImg src={LOGO}  className="introLogo"/>
          </div>
          <IonSlides pager={true} options={slideOpts} className="introSlide">
            <IonSlide>
              <div >
                <IonImg className="imgInto" src={INTRO1}  />
                <div className="introTxt">Planifica tu pedido fácilmente </div>
              </div>
            </IonSlide>
            <IonSlide>
              <div>
                <IonImg className="imgInto" src={INTRO2}  />
                <div className="introTxt">Asegura el precio y las cantidades justas para tu negocio</div>
              </div>
            </IonSlide>
            <IonSlide>
              <div >
                <IonImg className="imgInto" src={INTRO3}  />
                <div className="introTxt">Ahorra tiempo y dinero recogiendo tu pedido en solo pocos minutos</div>
              </div>
            </IonSlide>
            
          </IonSlides>

          

        </div>
      </div>

      <div className='ion-text-center introDescartar ' onClick={( () => discard())} >
          DESCARTAR
      </div>
      <div className="introDescartar ion-text-center">
          
      </div>

      </IonContent>
    </IonPage>
  );
    
  }


export default Intro;
