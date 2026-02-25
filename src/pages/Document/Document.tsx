import {
  IonContent,
  IonPage,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonLoading,
} from "@ionic/react";

import React, { useState } from "react";

import "./Document.css";

import { LOGO, NEXT, UPLOAD } from "../../const/imgs";

import { takePicture, Input } from "../../components/Inputs/Input";
import {
  postImg,
  getImgUsu,
  changeUser,
  getUsuDetail,
  getLocal,
  getLocalUser,
} from "../../api/user/user";

import { Toast } from "../../components/Alert/Alert";
import { Tabs } from "../../components/Tabs/Tabs";

const Document: React.FC<any> = (props) => {
  const [showLoading, setShowLoading] = useState(true);

  const [img1, setImg1] = useState<any>({ doc: 1, img: "", status: 0 });
  const [img2, setImg2] = useState<any>({ doc: 2, img: "", status: 0 });
  const [img3, setImg3] = useState<any>({ doc: 3, img: "", status: 0 });

  const [docs, setDocs] = useState(0);

  const [toast, setToast] = useState(false);
  const [toastClass, setToastClass] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [fetch, setFetch] = useState(false);

  const fetchData = async () => {
    const result = await getImgUsu();

    const datosUser = await getUsuDetail();

    setDocs(datosUser.data.docs);
    changeUser("docs", datosUser.data.docs);

    if (datosUser.data.docs === 3) props.history.push("/catalogue");

    if (result.data.length > 0) {
      const i1 = result.data.findIndex((img: any) => img.doc === 1);
      const i2 = result.data.findIndex((img: any) => img.doc === 2);
      const i3 = result.data.findIndex((img: any) => img.doc === 3);
      setImg1(result.data[i1]);
      setImg2(result.data[i2]);
      setImg3(result.data[i3]);
    }

    setShowLoading(false);
  };

  if (!fetch) {
    getLocal().then((res) => {
      if (res === "") props.history.push("/login");
      else {
        fetchData();
        setFetch(true);
      }
    });
  }

  const getImg = (number: string) => {
    takePicture().then((img) => {
      const base64String = img ? img : "";
      const stringLength =
        base64String.length - "data:image/png;base64,".length;
      const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
      const sizeInKb = sizeInBytes / 1000;
      //console.info("sizeInKb", sizeInKb);
      if (sizeInKb > 850) {
        setMensaje("la imágen es muy pesada");
        setToastClass("ToasError");
        setToast(true);
        return;
      }

      if (number === "1") {
        setImg1({ doc: 1, img: "" + img, status: 0 });
      }
      if (number === "2") {
        setImg2({ doc: 2, img: "" + img, status: 0 });
      }
      if (number === "3") {
        setImg3({ doc: 3, img: "" + img, status: 0 });
      }
    });
  };

  const saveImg = () => {
    setShowLoading(true);

    if (img1.img === "" || img2.img === "" || img3.img === "") {
      setMensaje("Debes ingresar los 3 documentos");
      setToastClass("ToasError");
      setToast(true);
      setShowLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const values = [img1, img2, img3];
        await postImg(values);
        setMensaje("Registrado exitosamente");
        getLocalUser().then((res: any) => {
          let newR = res;
          newR.docs = 1;
          changeUser("docs", 1);
          setDocs(1);
          setShowLoading(false);
          setToastClass("");
          setToast(true);
        });
        //console.log("result", result)
      } catch (error) {
        setMensaje("Ups! error en la petición");
        setShowLoading(false);
        setToastClass("ToasError");
        setToast(true);
      }
    };

    fetchData();
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonLoading
          isOpen={showLoading}
          onDidDismiss={() => setShowLoading(false)}
          spinner={null}
          message={`<img src="https://www.sanapp.info/Imagenes/prueba.gif" alt="San andres" height="42" width="42"/>`}
        />

        {Toast({
          message: mensaje,
          open: toast,
          onDissmis: () => {
            setToast(false);
          },
          showCloseBtn: true,
          duration: 3000,
          position: "bottom",
          className: toastClass,
        })}

        <div className="registerContent">
          <div className="registerContent2">
            <div className="">
              <IonImg src={LOGO} className="docLogo" />
            </div>

            <div className={"docTitle fontmilkshake ion-text-center"}>
              Documentos
            </div>

            <IonGrid>
              <IonRow>
                <IonCol
                  size={"9"}
                  onClick={() =>
                    img1.status === 2 || img1.status === 3 ? null : getImg("1")
                  }
                >
                  <Input
                    txt="Cédula"
                    onInput={() => {}}
                    value={""}
                    positionTxt={"floating"}
                    type={"text"}
                    className={"docInput"}
                    icon={UPLOAD}
                    disabled={true}
                  />
                </IonCol>

                <IonCol size={"3"}>
                  <Input
                    txt=" "
                    onInput={() => {}}
                    value={""}
                    positionTxt={"floating"}
                    type={"text"}
                    className={
                      img1.status === 2
                        ? "docInputVerde"
                        : img1.status === 1
                        ? "docInputRojo"
                        : "docInput"
                    }
                    icon={img1.img}
                    disabled={true}
                    onlyIcon={true}
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol
                  size={"9"}
                  onClick={() =>
                    img2.status === 2 || img2.status === 3 ? null : getImg("2")
                  }
                >
                  <Input
                    txt="Rut"
                    onInput={() => {}}
                    value={""}
                    positionTxt={"floating"}
                    type={"text"}
                    className={"docInput backColor"}
                    icon={UPLOAD}
                    disabled={true}
                  />
                </IonCol>
                <IonCol size={"3"}>
                  <Input
                    txt=" "
                    onInput={() => {}}
                    value={""}
                    positionTxt={"floating"}
                    type={"text"}
                    className={
                      img2.status === 2
                        ? "docInputVerde"
                        : img2.status === 1
                        ? "docInputRojo"
                        : "docInput"
                    }
                    icon={img2.img}
                    disabled={true}
                    onlyIcon={true}
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol
                  size={"9"}
                  onClick={() =>
                    img3.status === 2 || img3.status === 3 ? null : getImg("3")
                  }
                >
                  <Input
                    txt="Cámara de comercio"
                    onInput={() => {}}
                    value={""}
                    positionTxt={"floating"}
                    type={"text"}
                    className={"docInput"}
                    icon={UPLOAD}
                    disabled={true}
                  />
                </IonCol>
                <IonCol size={"3"}>
                  <Input
                    txt=" "
                    onInput={() => {}}
                    value={""}
                    positionTxt={"floating"}
                    type={"text"}
                    className={
                      img3.status === 2
                        ? "docInputVerde"
                        : img3.status === 1
                        ? "docInputRojo"
                        : "docInput"
                    }
                    icon={img3.img}
                    disabled={true}
                    onlyIcon={true}
                  />
                </IonCol>
              </IonRow>

              {(docs === 1 || docs === 2) && (
                <IonRow>
                  <IonCol size={"2"}></IonCol>
                  <IonCol size={"8"} className={"docBorder ion-text-center"}>
                    <div className={"docEstatus"}>Estatus</div>
                    <div className={" docVerBorder docVer ion-text-center"}>
                      Validando
                    </div>
                  </IonCol>
                  <IonCol size={"2"}></IonCol>
                </IonRow>
              )}
            </IonGrid>

            {(docs === 0 || docs === 2) && (
              <IonButton
                className="loginMarginTop21 loginBtn"
                onClick={() => saveImg()}
              >
                <IonImg className="icon02" src={NEXT} slot="start" />
                Guardar
              </IonButton>
            )}
          </div>
        </div>

        <div className="introDescartar ion-text-center"></div>

        <Tabs selected={"10"} />
      </IonContent>
    </IonPage>
  );
};

export default Document;
