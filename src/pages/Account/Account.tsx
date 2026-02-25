import {
  IonContent,
  IonPage,
  IonLoading,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
  IonToggle,
  IonModal,
} from "@ionic/react";

import React, { useState, useEffect, useContext } from "react";

import "./Account.css";

import { Tabs } from "../../components/Tabs/Tabs";
import { getUsuDetail, removeSesionData, putUsu } from "../../api/user/user";
import {
  DESDERECHA,
  MIPERFIL,
  CERRARSESION,
  MISORDENES,
  BACK,
  LOADINGCARRITO,
} from "../../const/imgs";

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";
import { getPoliticas, getWs } from "../../api/public/public";
import InfoContext from "../../context/InfoContext";

const { PushNotifications } = Plugins;

const Account: React.FC<any> = (props) => {
  const { loadingCar } = useContext<any>(InfoContext);
  const [showLoading, setShowLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [txtPolitica, setTxtPolitica] = useState("");

  const [data, setData] = useState<any>([]);

  const [ws, setWs] = useState("");

  const getDataWs = async () => {
    const { data } = await getWs();
    setWs(data.name);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setShowLoading(true);
        const result = await getUsuDetail();
        if (!data.length) setData(result.data);

        setShowLoading(false);
      } catch (error) {
        console.log("errrorr", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const getPolitica = async () => {
      const { data } = await getPoliticas();
      //se utilizo img ya que es el campo mas grande, de esta manera insertar el texto tan largo
      setTxtPolitica(data.img);
    };
    getPolitica();
  }, []);

  const logOut = () => {
    setShowLoading(true);

    removeSesionData().then(() => {
      props.history.push("/login");
      setShowLoading(false);
    });
  };

  const fetchPushNotification = (token: any) => {
    return putUsu({ changePush: true, deviceToken: token });
  };

  const push = async () => {
    //console.info("push...")
    setShowLoading(true);
    //const res = await fetchPushNotification('123')
    //console.log("ressss", res)

    //setData({...data, deviceToken: data.deviceToken ? '' : data.deviceToken})
    // Register with Apple / Google to receive push via APNS/FCM
    if (data.deviceToken) {
      //console.info('11111')
      await fetchPushNotification(null);
      setData({ ...data, deviceToken: null });
      await PushNotifications.removeAllDeliveredNotifications();
      //PushNotifications.removeAllListeners()
      setShowLoading(false);
    } else {
      //console.info("2222")

      const x = PushNotifications.requestPermissions;
      //console.info("222211111", x)
      const y = PushNotifications.register();
      //console.info ("333",y)

      /*
      PushNotifications.listChannels().then( (res: any) => {
        
      console.log("res", res)
        
      })
      */

      // On succcess, we should be able to receive notifications
      PushNotifications.addListener(
        "registration",
        async (token: PushNotificationToken) => {
          //console.log('Push registration success, token: ' + token.value);

          await fetchPushNotification(token.value);
          setData({ ...data, deviceToken: token.value });
          setShowLoading(false);
        }
      );

      // Some issue with your setup and push will not work
      PushNotifications.addListener("registrationError", (error: any) => {
        //console.info('3333', JSON.stringify(error))
        alert("Error on registration: " + JSON.stringify(error));
      });

      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener(
        "pushNotificationReceived",
        (notification: PushNotification) => {
          //cuando esta en la app abierta
          //console.log("111111111111111")
        }
      );

      // Method called when tapping on a notification
      PushNotifications.addListener(
        "pushNotificationActionPerformed",
        (notification: PushNotificationActionPerformed) => {
          //cunado le da click al msj q le aparece arriba
          //console.log("22222222222222")
        }
      );
    }

    setShowLoading(false);
  };

  useEffect(() => {
    getDataWs();
  }, []);

  return (
    <IonPage>
      {
        //loadingCar && <IonContent className="ion-padding"> <img style={{marginTop: "40vh", marginLeft: "43vw"}} src="https://www.sanapp.info/Imagenes/prueba.gif" className="loading" alt="San andres"/> </IonContent>
      }
      {
        //!loadingCar &&
        <IonContent className="ion-padding">
          <IonLoading
            isOpen={showLoading || loadingCar}
            onDidDismiss={() => setShowLoading(false)}
            spinner={null}
            message={`<img src="https://www.sanapp.info/Imagenes/prueba.gif" class="loading" alt="San andres"/>`}
          />

          <IonModal isOpen={modal} onDidDismiss={() => setModal(false)}>
            <IonImg
              className="categoryBack"
              src={BACK}
              onClick={() => setModal(false)}
            />
            <div className={"RegisterTxtTermino ion-text-justify"}>
              <td
                className="registetTc"
                dangerouslySetInnerHTML={{ __html: txtPolitica }}
              />
            </div>
          </IonModal>

          <div className="registerContent">
            <div className="registerContent2">
              <div className="catalogueHeader_">
                <div className="catalogueBuscar">
                  <div className="ion-text-center fontmilkshake catalogueTxt24">
                    Mi cuenta
                  </div>
                </div>
              </div>
            </div>
          </div>

          <br />
          <br />

          <div className="">
            <IonGrid>
              <IonRow
                className="accountBox"
                onClick={() =>
                  props.history.push("/profile", {
                    fetch10: Math.floor(Math.random() * 10000 + 1),
                  })
                }
              >
                <IonCol size={"2"}>
                  <IonImg className={"supportIcon"} src={MIPERFIL} />
                </IonCol>
                <IonCol size={"8"} className="accountTxt1">
                  Mi Perfil
                </IonCol>
                <IonCol size={"2"}>
                  <IonImg className={"supportIcon"} src={DESDERECHA} />
                </IonCol>
              </IonRow>
              <IonRow
                className="accountBox"
                onClick={() =>
                  props.history.push("/myOrder", {
                    fetch5: Math.floor(Math.random() * 10000 + 1),
                  })
                }
              >
                <IonCol size={"2"}>
                  <IonImg className={"supportIcon"} src={MISORDENES} />
                </IonCol>
                <IonCol size={"8"} className="accountTxt1">
                  Mis Ordenes
                </IonCol>
                <IonCol size={"2"}>
                  <IonImg className={"supportIcon"} src={DESDERECHA} />
                </IonCol>
              </IonRow>

              <IonGrid>
                <IonRow className={"accountBox"}>
                  <IonCol size={"2"} />
                  <IonCol size={"8"} className="accountTxt1">
                    Notificaciones
                  </IonCol>
                  <IonCol
                    onClick={() => push()}
                    size={"2"}
                    className="accountTxt1"
                  >
                    <IonToggle checked={data.deviceToken !== null} disabled />
                  </IonCol>
                </IonRow>
              </IonGrid>

              <IonRow className="accountBox" onClick={() => setModal(true)}>
                <IonCol size={"2"}>
                  <IonImg className={"supportIcon"} src={MISORDENES} />
                </IonCol>
                <IonCol size={"8"} className="accountTxt1">
                  Politicas de uso
                </IonCol>
                <IonCol size={"2"}>
                  <IonImg className={"supportIcon"} src={DESDERECHA} />
                </IonCol>
              </IonRow>

              <IonRow className="accountBox" onClick={() => logOut()}>
                <IonCol size={"2"}>
                  <IonImg className={"supportIcon"} src={CERRARSESION} />
                </IonCol>
                <IonCol size={"8"} className="accountTxt1">
                  Salir
                </IonCol>
              </IonRow>

              <IonRow className="accountBox">
                <IonCol size={"2"} />
                <IonCol size={"8"} className="accountTxt1">
                  <a
                    target="_blanck"
                    rel="noreferrer"
                    href={`https://wa.me/${ws}?text=deseo%20eliminar%20mi%20cuenta%20de%20usuario`}
                  >
                    Eliminar mi cuenta
                  </a>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
          <Tabs selected={"5"} />
        </IonContent>
      }
    </IonPage>
  );
};

export default Account;
