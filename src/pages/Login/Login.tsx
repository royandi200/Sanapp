import {
  IonContent,
  IonPage,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonLoading,
} from "@ionic/react";

import React, { useState, useEffect } from "react";

import { logIn, sendNewPass } from "../../api/public/public";

import "./Login.css";

import { LOGO, EMAIL, LOCK, NEXT, VER } from "../../const/imgs";

import { Link } from "react-router-dom";
import { Input } from "../../components/Inputs/Input";
import { Toast } from "../../components/Alert/Alert";
import { getLocal, getLocalUser } from "../../api/user/user";

import { Plugins } from "@capacitor/core";

const { Device } = Plugins;

let datosDevice: any = {};

Device.getInfo().then((device: any) => {
  datosDevice = device;
});

const Login: React.FC<any> = (props) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [showLoading, setShowLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const [toastClass, setToastClass] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [token, setToken] = useState("");
  const [showPass, setShowPass] = useState(false);

  console.info(`PIRELA LOGIN ${JSON.stringify(props)}`);

  const changePass = () => {
    const fetchChangePass = async () => {
      try {
        if (!email) {
          setToastClass("ToasError");
          setMensaje("Ingrese su email");
          setToast(true);
          return;
        }

        setShowLoading(true);

        const result = await sendNewPass({
          email,
        });

        if (result.data.status === "bien") {
          setMensaje("Hemos enviado un sms con tu nueva clave");
          setToastClass("");
          setToast(true);
        } else {
          setToastClass("ToasError");
          setMensaje("Se presento un error al recuperar contraseña");
          setToast(true);
        }

        setShowLoading(false);
      } catch (error) {
        setToastClass("ToasError");
        setMensaje("Se presento un error al recuperar contraseña");
        setToast(true);

        setShowLoading(false);
      }
    };

    fetchChangePass();
  };

  const login = () => {
    setShowLoading(true);

    const fetchData = async () => {
      try {
        const result = await logIn({
          email,
          password,
          datosDevice,
        });

        setShowLoading(false);
        if (result.data !== -2 && result.data !== -3) {
          setEmail("");
          setPassword("");
          if (result.data.intro) props.history.push("/intro");
          else {
            if (result.data.docs === 3) {
              props.history.push("/catalogue");
              console.info(`PIRELA LOGIN 00011 ${JSON.stringify(props)}`);
            } else {
              props.history.push("/document");
            }
          }
        } else {
          if (result.data === -3) {
            setMensaje("Este dispositivo no esta asociado a dicha cuenta");
            setToastClass("ToasError");
            setToast(true);
          } else {
            setMensaje("Error en la combinación de correo y contraseña");
            setToastClass("ToasError");
            setToast(true);
          }
        }
      } catch (error) {
        setMensaje("Ups! error en la petición");
        setShowLoading(false);
        setToastClass("ToasError");
        setToast(true);
      }
    };

    fetchData();
  };

  useEffect(() => {
    getLocal().then((res) => {
      if (res) {
        getLocalUser().then((usu) => {
          if (usu.intro === 1) props.history.push("/intro");
          else {
            if (usu.docs === 3) {
              props.history.push("/catalogue");
              console.info(`PIRELA LOGIN 00022 ${JSON.stringify(props)}`);
            } else {
              props.history.push("/document");
            }
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    getLocal().then((res) => {
      if (res) {
        getLocalUser().then((usu) => {
          if (usu.intro === 1) props.history.push("/intro");
          else {
            if (usu.docs === 3) {
              props.history.push("/catalogue");
              console.info(`PIRELA LOGIN 00033 ${JSON.stringify(props)}`);
            } else {
              props.history.push("/document");
            }
          }
        });
      }
    });
  }, [token]);

  const txt2 = "Ingreso";

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
          className: toastClass,
        })}

        <div className="registerContent">
          <div className="registerContent2">
            <IonGrid className="loginMarginTop1">
              <IonRow>
                <IonCol className="ion-text-center icon">
                  <img className="loginImg" src={LOGO} alt="" />
                </IonCol>
              </IonRow>
            </IonGrid>

            <p className="ion-text-center loginMarginTop2 fontmilkshake">
              {txt2}
            </p>

            <Input
              txt="Correo"
              onInput={setEmail}
              value={email}
              positionTxt={"floating"}
              type={"text"}
              icon={EMAIL}
            />

            <Input
              txt="Contraseña"
              onInput={setPassword}
              value={password}
              positionTxt={"floating"}
              type={showPass ? "text" : "password"}
              icon={LOCK}
              icon2={VER}
              onClickIcon2={() => setShowPass(!showPass)}
            />

            <div
              className="ion-text-center"
              style={{
                fontSize: "16px",
                textDecoration: "none",
                color: "#A6BCD0",
              }}
              onClick={() => changePass()}
            >
              Recuperar contraseña
            </div>

            <IonButton
              className="loginMarginTop21 loginBtn"
              onClick={() => login()}
            >
              <IonImg className="icon02" src={NEXT} slot="start" />
              Ingresar
            </IonButton>
          </div>
        </div>

        <div className="ion-text-center loginMarginTop21">
          <Link
            className=""
            style={{
              fontSize: "14px",
              textDecoration: "none",
              color: "#A6BCD0",
            }}
            to="/register"
          >
            CREAR CUENTA
          </Link>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
