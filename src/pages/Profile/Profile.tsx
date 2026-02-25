import {
  IonContent,
  IonPage,
  IonLoading,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
} from "@ionic/react";

import React, { useState, useEffect, useCallback } from "react";

import "./Profile.css";

import { getUsuDetail, getMyStores, putUsu } from "../../api/user/user";
import { post } from "../../api/store/store";
import { NEXT, USER, PHONE, BACK } from "../../const/imgs";
import { Input } from "../../components/Inputs/Input";

import { Map } from "../../components/Map/Map";
import { Toast } from "../../components/Alert/Alert";
import { Link } from "react-router-dom";

import * as EmailValidator from "email-validator";
import { TYPE } from "../../const/functions";

const initialState = {
  nombre: "",
  apellido: "",
  tipo: TYPE.DOCCC,
  documento: "",
  email: "",
  clave: "",
  clave2: "",
  nombreTienda: "",
  telefono: "",
  condiciones: false,
  points: 0,
};

const Profile: React.FC<any> = (props) => {
  const [showLoading, setShowLoading] = useState(true);
  const [data, setData] = useState<any>([]);
  const [stores, setStores] = useState<any>([]);

  const [formData, setFormData] = useState<any>(initialState);
  const [neighborhood, setNeighborhood] = useState("");
  const [locality, setLocality] = useState("");
  const [department, setDepartment] = useState("");
  const [city, setCity] = useState("");
  const [addres, setAddres] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [toast, setToast] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const [useFetch, setUseFetch] = useState("");
  const propFetch = props.location
    ? props.location.state
      ? props.location.state.fetch10
      : null
    : useFetch;

  if (propFetch !== useFetch && propFetch) setUseFetch(propFetch);

  const fetchData0 = async () => {
    try {
      setShowLoading(true);
      const result = await getUsuDetail();
      setFormData({
        ...formData,
        identification: result.data.identification,
        points: result.data.points,
        name: result.data.name,
        lastName: result.data.lastName,
        cedula: result.data.cedula,
        email: result.data.email,
      });

      const stores = await getMyStores();
      setStores(stores.data);

      if (!data.length) setData(result.data);

      setShowLoading(false);
    } catch (error) {
      console.log("errrorr", error);
    }
  };

  useEffect(() => {
    fetchData0();
  }, [useFetch]);

  const setField = useCallback(
    (fieldName = "") =>
      (value: any) => {
        if (value.persist) value.persist();
        setFormData({
          ...formData,
          [fieldName]: value.persist ? value.target.value : value,
        });
      },
    [formData]
  );

  const validateStore = () => {
    let msj = "",
      count = 0;
    if (formData.nombreTienda === "") {
      msj += "Ingrese el nombre de la tienda";
      count += 1;
    }

    if (formData.telefono === "") {
      msj +=
        count > 0
          ? ", ingrese el teléfono de la tienda"
          : "Ingrese el teléfono de la tienda";
      count += 1;
    }

    if (addres === "") {
      msj +=
        count > 0
          ? ", ingrese la dirección de la tienda"
          : "Ingrese la dirección de la tienda";
      count += 1;
    }

    if (count) {
      setMensaje(msj);
      setToast(true);
    }

    return !count ? true : false;
  };
  const Save = () => {
    if (!validateStore()) return;

    const fetchData = async () => {
      setShowLoading(true);

      const store = {
        name: formData.nombreTienda,
        phone: formData.telefono,
        locality: locality,
        neighborhood: neighborhood,
        addres: addres,
        city: city,
        department: department,
        idStatus: 1,
        latitude: latitude,
        longitude: longitude,
      };

      try {
        const newStore = await post(store);
        setStores([...stores, newStore.data.data]);
        setFormData({ ...initialState });
        setMensaje("Registrado exitosamente");
        setShowLoading(false);
        setToast(true);
      } catch (error) {
        setMensaje("Ups! error en la petición");
        setShowLoading(false);
        setToast(true);
      }
    };
    fetchData();
  };

  const SaveUser = () => {
    if (!EmailValidator.validate(formData.email)) {
      setMensaje("El email no es válido");
      setToast(true);
      return;
    }

    const fetchData = async () => {
      setShowLoading(true);
      try {
        await putUsu({
          password: formData.password,
          email: formData.email,
        });
        setMensaje("Email y clave actualizado");
        setShowLoading(false);
        setToast(true);
      } catch (error) {
        setMensaje("Ups! error en la petición");
        setShowLoading(false);
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
          message={`<img src="https://www.sanapp.info/Imagenes/prueba.gif" class="loading" alt="San andres"/>`}
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
        })}

        <Link
          style={{ textDecoration: "none" }}
          className="categoryBack"
          to={"/account"}
        >
          <IonImg src={BACK} />
        </Link>

        <div className="registerContent">
          <div className="registerContent2">
            <div className="catalogueHeader_">
              <div className="catalogueBuscar">
                <div className="ion-text-center fontmilkshake catalogueTxt24">
                  Mi Perfil
                </div>
              </div>
            </div>
          </div>
        </div>

        <br />
        <br />
        <div className="profileTxt1">Información</div>
        <div className="profileBox">
          <IonGrid>
            <IonRow className="profileTxt2">
              <IonCol size={"4"}>Nombre</IonCol>
              <IonCol className="profileTxt22" size={"8"}>
                {formData.name}
              </IonCol>
            </IonRow>

            <IonRow className="profileTxt2">
              <IonCol size={"4"}>Apellido</IonCol>
              <IonCol className="profileTxt22" size={"8"}>
                {formData.lastName}
              </IonCol>
            </IonRow>

            <IonRow className="profileTxt2">
              <IonCol size={"4"}>Cédula</IonCol>
              <IonCol className="profileTxt22" size={"8"}>
                {formData.identification}
              </IonCol>
            </IonRow>
            <IonRow className="profileTxt2">
              <IonCol size={"4"}>Puntos SanApp</IonCol>
              <IonCol className="profileTxt22" size={"8"}>
                {formData.points}
              </IonCol>
            </IonRow>
          </IonGrid>

          <Input
            txt="Email"
            onInput={setField("email")}
            value={formData.email}
            positionTxt={"floating"}
            type={"text"}
            className={"marBot"}
          />
          <Input
            txt="Clave"
            onInput={setField("password")}
            value={formData.password}
            positionTxt={"floating"}
            type={"password"}
            className={"marBot"}
          />
        </div>

        <IonButton
          className="marginTop3 registerBtn"
          onClick={() => SaveUser()}
        >
          <IonImg className="icon02" src={NEXT} slot="start" />
          Actualizar
        </IonButton>

        <div className="profileTxt1">Tiendas</div>

        <div>
          {stores.map((store: any, indStore: number) => (
            <div>
              <IonGrid key={indStore} className="profileBox">
                <IonRow className="profileTxt2">
                  <IonCol size={"4"}>Nombre</IonCol>
                  <IonCol size={"8"}>{store.name}</IonCol>
                </IonRow>
                <IonRow className="profileTxt2">
                  <IonCol size={"4"}>Dirección</IonCol>
                  <IonCol size={"8"}>{store.addres}</IonCol>
                </IonRow>
              </IonGrid>
              <br />
            </div>
          ))}
        </div>

        <div className="profileTxt1">Crear nueva tienda</div>

        <Input
          txt="Nombre"
          onInput={setField("nombreTienda")}
          value={formData.nombreTienda}
          positionTxt={"floating"}
          type={"text"}
          icon={USER}
        />
        <div className="map">
          <Map
            loading={setShowLoading}
            setAddres={setAddres}
            setCity={setCity}
            setDepartment={setDepartment}
            setLocality={setLocality}
            setNeighborhood={setNeighborhood}
            setLatitude={setLatitude}
            setLongitude={setLongitude}
          />
        </div>

        <br />
        <br />
        <br />
        <br />

        <Input
          txt="Celular"
          onInput={setField("telefono")}
          value={formData.telefono}
          positionTxt={"floating"}
          type={"tel"}
          icon={PHONE}
        />

        <br />
        <IonButton className="marginTop3 registerBtn" onClick={() => Save()}>
          <IonImg className="icon02" src={NEXT} slot="start" />
          Crear
        </IonButton>

        <br />
        <br />
      </IonContent>
    </IonPage>
  );
};

export default Profile;
