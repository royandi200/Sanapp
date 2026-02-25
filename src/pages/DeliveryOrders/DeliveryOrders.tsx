import {
  IonContent,
  IonPage,
  IonImg,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonSlides,
  IonSlide,
  IonLoading,
} from "@ionic/react";

import React, { useState, useEffect } from "react";

import "./DeliveryOrders.css";

import dayjs from "dayjs";

import NumberFormat from "react-number-format";

import { SUMMARY, NEXT, BACK } from "../../const/imgs";
import { SUMMARYGREY } from "../../const/imgs";
import { DELIVERY } from "../../const/imgs";
import { DELIVERYGREY } from "../../const/imgs";

import { InputSelect } from "../../components/Inputs/Input";
import { getMyStores, getLocalUser } from "../../api/user/user";
import { CardOrderProduct } from "../../components/Cards/Card";
import {
  changeOrderDetExis,
  getUserPreOrder,
  orderFinally,
} from "../../api/pedido/pedido";
import { Toast, Confirm } from "../../components/Alert/Alert";
import { TYPE, IVA } from "../../const/functions";
import { Link } from "react-router-dom";
import { getCalendar } from "../../api/calendar/calendar";
import {
  getCardinales,
  getDiasCardinalidad,
} from "../../api/cardinales/cardinales";
import { getFlete } from "../../api/flete/flete";

const initialState = {
  idStore: "",
  paymentMethod: "Contra Entrega",
  isDelivery: false,
  date: dayjs(),
  time: { txt: "", min: 0, max: 0 },
  day: { time: [] },
  cardinal: "",
};

const slideOpts = {
  initialSlide: 0,
  speed: 400,
  slidesPerView: 3.2,
};

const TOTALES = {
  subTotal: 0,
  ahorro: 0,
  retencion: 0,
  total: 0,
  puntos: 0,
  flete: 0,
};

const DeliveryOrders: React.FC<any> = (props) => {
  const [formData, setFormData] = useState(initialState);
  const [days, setDays] = useState<any>([{}, {}, {}, {}, {}]);
  const [stores, setStores] = useState<any>([]);
  const [showLoading, setShowLoading] = useState(true);
  const [delivery, setDelivery] = useState(true);
  const [toast, setToast] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [duration, setDuracion] = useState(3000);
  const [mensaje, setMensaje] = useState("");
  const [toastClass, setToastClass] = useState("");
  const [order, setOrder] = useState<any>({});
  const [totales, setTotales] = useState<any>({ ...TOTALES });
  const [userRetencion, setUserRetencion] = useState(0);
  const [useFetch, setUseFetch] = useState("");

  const [hours, setHours] = useState<any>([]);

  const [changeOrderDet, setChangeOrderDet] = useState<any>([]);

  const [cardinales, setCardinales] = useState<any>([]);
  const [loadingCardinales, setLoadingCardinales] = useState<boolean>(false);

  const propFetch = props.location.state
    ? props.location.state.fetch
    : useFetch || useFetch;

  if (propFetch !== useFetch) {
    setUseFetch(propFetch);
    setStores([]);
    setFormData({ ...initialState });

    const fetchDays = async () => {
      const result = await getCalendar(dayjs().hour() < 12);
      console.info("*result*", result);
      result.data.map(
        (calendar: any) => (calendar.value = dayjs(calendar.value))
      );
      console.info("*result*", result.data);
      //setDays(result.data.map( (item: any) => ({txt: item})));
    };
    //fetchDays();

    setShowLoading(true);
  }

  const preSetDelivery = (value: any) => {
    let hoy = dayjs().format("DD-MM-YYYY");
    console.info("01", formData.date.format("DD-MM-YYYY") !== hoy);
    console.info("02", formData.paymentMethod !== "");
    console.info("03", formData.isDelivery);
    if (
      //formData.date.format("DD-MM-YYYY") !== hoy &&
      //formData.time.min > 0 &&
      formData.paymentMethod !== "" &&
      !formData.isDelivery
    ) {
      setDelivery(value);
      console.info("if");
    } else {
      let msj = "";
      if (formData.cardinal === "" && formData.isDelivery) {
        msj += "Seleccione su Punto Cardinal";
      }
      if (
        formData.date.format("DD-MM-YYYY") === hoy &&
        msj === "" &&
        formData.isDelivery
      ) {
        msj += "Seleccione un día de entrega";
      }
      /*
      if (formData.time.min === 0 && msj === "")
        msj += "Seleccione la hora de entrega";
      */
      if (formData.paymentMethod === "" && msj === "") {
        msj += "Seleccione el método de pago";
      }

      console.info("ELSE");
      if (msj === "") {
        setDelivery(value);
      } else {
        setMensaje(msj);
        setShowLoading(false);
        setDuracion(3000);
        setToastClass("");
        setToast(true);
      }
    }
  };

  const Save = () => {
    const timeEnd = formData.time.txt.split("- ");

    let promiseDeliveryDate = dayjs(formData.date)
      .hour(formData.time.max + 5)
      .minute(0)
      .second(0);

    const obj = {
      idStore: formData.idStore,
      idPaymentMethod:
        formData.paymentMethod === "Contra Entrega"
          ? TYPE.CONTRAENTREGA
          : TYPE.CONSIGNACION,
      idStatus:
        formData.paymentMethod === "Contra Entrega"
          ? TYPE.CONFIRMADO
          : TYPE.PENDIENTE,
      deliveryWindow: formData.date.format("YYYY-MM-DD"), //+ " ; " + formData.time.txt,
      deliveryDate: formData.date.format("YYYY-MM-DD") + " ; " + timeEnd[1],
      promisedDeliveryDate: promiseDeliveryDate.format("YYYY-MM-DD HH:mm:ss"),
      id: order.id,
      totalAmount: totales.subTotal - totales.ahorro - totales.retencion + totales.flete,
      retencion: totales.retencion,
      discountAmount: totales.ahorro,
      fleteAmount: totales.flete,
      deliveryAmount: 0,
      amountPayed: 0,
      idCardenalidad: formData.cardinal,
      isDelivery: formData.isDelivery,
      
    };

    setShowLoading(true);

    const fetchData = async () => {
      try {
        const result = await orderFinally({
          ...obj,
          finish: true,
          detail: order.orderItems,
        });
        if (result.error) {
          console.info("result", result);
          console.info(
            "result.sinExistenciaresult.sinExistencia",
            result.sinExistencia
          );
          setChangeOrderDet(result.sinExistencia);
          setMensaje(result.error);
          setDuracion(30000);
          setShowLoading(false);
          setToastClass("ToasError");
          //setToast(true);
          setConfirm(true);
        } else {
          setDelivery(true);
          setMensaje("Registrado exitosamente");
          setShowLoading(false);
          setDuracion(3000);
          setToastClass("");
          setToast(true);
          props.history.push("/voucher", {
            idOrder: result.data.id,
            showSave: false,
          });
        }
      } catch (error) {
        alert(error);
        setMensaje("Ups! error en la petición");
        setShowLoading(false);
        setDuracion(3000);
        setToastClass("ToasError");
        setToast(true);
      }
    };
    fetchData();
  };

  const fetchData = async () => {
    const result = await getMyStores();
    const user = await getLocalUser();

    const { data: dataCardinales } = await getCardinales(1);
    setCardinales(dataCardinales);

    setUserRetencion(user.facElec);
    setStores(result.data);
    setFormData({
      ...formData,
      idStore: result.data[0].id,
    });
    const resultOrder = await getUserPreOrder();

    setOrder(resultOrder.data);
    setShowLoading(false);
  };

  if (!stores.length) {
    fetchData();
  }

  const setOnlyDay = (day: any) => {
    setFormData({
      ...formData,
      date: day.txt,
      time: { txt: "", min: 0, max: 0 },
      day,
    });
  };

  useEffect(() => {
    if (formData.day.time) {
      if (formData.day.time.length === 5) {
        setHours(formData.day.time);
      } else {
        const newTime = [];
        for (let i = 0; i < 5 - formData.day.time.length; i++) {
          newTime.push({ hidden: true });
        }
        setHours([...formData.day.time, ...newTime]);
      }
    }
    console.info("formData", formData);
  }, [formData]);

  useEffect(() => {
    const getdiasCardi = async () => {
      //console.info("//formData.cardinal//", formData.cardinal !== "")
      if (formData.cardinal !== "") {
        //setShowLoading(true);
        setDays([{}, {}, {}, {}, {}]);
        setLoadingCardinales(true);
        const pedidoCardinal = cardinales.find(
          (card: any) => card.id === formData.cardinal
        );
        const { data: dataCardinales } = await getDiasCardinalidad(
          formData.cardinal,
          pedidoCardinal.cantidad
        );
        //console.info("***-*---***dataCardinales---", dataCardinales, formData.cardinal)
        setDays(dataCardinales.map((day: any) => ({ txt: dayjs(day) })));
        setLoadingCardinales(false);
        //setShowLoading(false);
      }
    };
    getdiasCardi();
  }, [formData.cardinal]);

  useEffect(() => {
    if (!(order || {}).orderItems) {
      setTotales({
        total: 0,
        ahorro: 0,
        retencion: 0,
        subTotal: 0,
        puntos: 0,
        flete: 0,
      });
      return;
    }
    let total = 0,
      subTotal = 0,
      ahorro = 0,
      retencion = 0,
      puntos = 0;
    order.orderItems.forEach((item: any) => {
      if (item.idProduct) {
        subTotal += item.presentation.price * item.quantity;
        puntos += item.presentation.points;
      }
      if (item.idPromotion) {
        subTotal +=
          (item.promotion.price + item.promotion.discount) * item.quantity;
        ahorro += item.promotion.discount * item.quantity;
        puntos += item.promotion.points;
      }
    });
    if (userRetencion) {
      retencion = (subTotal - ahorro) * IVA;
    }
    total = subTotal - ahorro - retencion;
    setTotales({
      ...totales,
      total,
      ahorro,
      retencion,
      subTotal,
      puntos,
    });
  }, [order]);

  const getValueFlete = async ({ idCardinal }: any) => {
    const { data } = await getFlete({ idCardinal, monto: totales.total });

    const flete = totales.total * (data.porcentaje / 100);

    setTotales({ ...totales, flete });
  };

  const changeValuesOrderDet = async () => {
    const result = await changeOrderDetExis(changeOrderDet);
    //console.info("result", result);
    props.history.push("/preOrder");
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
          duration: duration,
          position: "bottom",
          className: toastClass,
        })}
        {
          <Confirm
            open={confirm}
            onDissmis={() => {
              setConfirm(false);
            }}
            header={"Aviso"}
            subH={""}
            message={mensaje}
            buttons={[
              {
                text: "Salir",
                role: "cancel",
                cssClass: "secondary",
                handler: () => {
                  setConfirm(false);
                },
              },
              {
                text: "Descontar",
                handler: () => {
                  changeValuesOrderDet();
                },
              },
            ]}
          />
        }
        {delivery && (
          <Link
            style={{ textDecoration: "none" }}
            className="categoryBack"
            to={{
              pathname: "/preOrder",
              state: { fetch4: Math.floor(Math.random() * 10000 + 1) },
            }}
          >
            <IonImg src={BACK} />
          </Link>
        )}
        {!delivery && (
          <IonImg
            src={BACK}
            onClick={() => setDelivery(true)}
            className={"categoryBack"}
          />
        )}
        <div className="registerContent">
          <div className="registerContent2">
            <div className="DeliveryOrderHeader2">
              <div className="catalogueBuscar ion-text-center">
                <div className="preOrderCenter fontmilkshake">
                  <div>
                    {delivery ? "Entrega y Pago" : "Resumen pedido"}
                    <IonGrid className="deliveryOrderMinusTop">
                      <IonRow>
                        <IonCol size={"6"}>
                          <IonButton
                            className={
                              !delivery
                                ? "deliveryOrderBtn1"
                                : "deliveryOrderBtn"
                            }
                            onClick={() => preSetDelivery(true)}
                          >
                            Entrega
                            <IonImg
                              className={
                                !delivery
                                  ? "deliveryOrderIcon"
                                  : "deliveryOrderIcon"
                              }
                              src={!delivery ? DELIVERYGREY : DELIVERY}
                              slot="start"
                            />
                          </IonButton>
                        </IonCol>
                        <IonCol size={"6"}>
                          <IonButton
                            className={
                              delivery
                                ? "deliveryOrderBtn1 "
                                : "deliveryOrderBtn"
                            }
                            onClick={() => preSetDelivery(false)}
                          >
                            Resumen
                            <IonImg
                              className={
                                !delivery
                                  ? "deliveryOrderIcon1"
                                  : "deliveryOrderIcon1"
                              }
                              src={delivery ? SUMMARYGREY : SUMMARY}
                              slot="end"
                            />
                          </IonButton>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {delivery ? (
          <div>
            <IonGrid className="deliveryMargintTop">
              <IonRow>
                <IonCol
                  className="ion-text-center columNoPadding paddingTop"
                  size="12"
                >
                  <InputSelect
                    txt="Nombre de la tienda"
                    onInput={(e: string) =>
                      setFormData({
                        ...formData,
                        idStore: e,
                      })
                    }
                    data={stores}
                    positionTxt={"floating"}
                    value={formData.idStore}
                    propId={"id"}
                    propTxt={"name"}
                  />
                </IonCol>
              </IonRow>
              {/*
              <IonRow className="deliveryOrderMethod">Método de pago</IonRow>

              <IonRow className="deliveryORderTop2">
                <IonCol
                  className={
                    formData.paymentMethod === "Contra Entrega"
                      ? "ion-text-center paddingTop deliveryMethodOpc2 deliveryOrderSelected"
                      : "ion-text-center paddingTop deliveryMethodOpc2"
                  }
                  size="5"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      paymentMethod: "Contra Entrega",
                    })
                  }
                >
                  Pago en punto de venta
                </IonCol>
                <IonCol className="ion-text-center" size="1" />
                <IonCol
                  className={
                    formData.paymentMethod === "Consignación"
                      ? "ion-text-center paddingTop deliveryMethodOpc1 deliveryOrderSelected"
                      : "ion-text-center paddingTop deliveryMethodOpc1"
                  }
                  size="5"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      paymentMethod: "Consignación",
                    })
                  }
                >
                  Consignación
                </IonCol>
              </IonRow>
*/}
              <IonRow className="deliveryOrderMethod">Método de entrega</IonRow>

              <IonRow className="deliveryORderTop2">
                <IonCol
                  className={
                    !formData.isDelivery
                      ? "ion-text-center paddingTop deliveryMethodOpc2 deliveryOrderSelected"
                      : "ion-text-center paddingTop deliveryMethodOpc2"
                  }
                  size="5"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      isDelivery: false,
                      cardinal: ""
                    });
                    setTotales({ ...totales, flete: 0 });
                  }}
                >
                  <span> Recoge en punto de venta </span>
                  <span style={{ marginTop: "4px" }}>
                    <NumberFormat
                      prefix="$"
                      thousandSeparator="."
                      decimalSeparator=","
                      value={totales.total}
                      displayType={"text"}
                      decimalScale={0}
                    />
                  </span>
                </IonCol>
                <IonCol className="ion-text-center" size="1" />
                <IonCol
                  className={
                    formData.isDelivery
                      ? "ion-text-center paddingTop deliveryMethodOpc1 deliveryOrderSelected"
                      : "ion-text-center paddingTop deliveryMethodOpc1"
                  }
                  size="5"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      isDelivery: true,
                    })
                  }
                >
                  <span> A domicilio </span>
                  {totales.flete > 0 ? (
                    <span style={{ marginTop: "4px" }}>
                      <NumberFormat
                        prefix="$"
                        thousandSeparator="."
                        decimalSeparator=","
                        value={totales.total + totales.flete}
                        displayType={"text"}
                        decimalScale={0}
                      />
                    </span>
                  ) : (
                    <span style={{ fontSize: "10px" }}>
                      pendiente por calcular
                    </span>
                  )}
                </IonCol>
              </IonRow>

              {formData.isDelivery && <br />}
              {formData.isDelivery && (
                <IonRow className="deliveryOrderMethod">Punto cardinal</IonRow>
              )}
              {formData.isDelivery && (
                <IonRow className="deliveryORderTop2">
                  {cardinales.map((cardinal: any) => (
                    <IonCol
                      className={
                        formData.cardinal === cardinal.id
                          ? "ion-text-center paddingTop deliveryMethodOpc3 deliveryOrderSelected"
                          : "ion-text-center paddingTop deliveryMethodOpc3"
                      }
                      size={"5"}
                      onClick={() => {
                        setFormData({
                          ...formData,
                          cardinal: cardinal.id,
                        });
                        getValueFlete({ idCardinal: cardinal.id });
                      }}
                    >
                      {cardinal.descripcion}
                    </IonCol>
                  ))}
                </IonRow>
              )}
              {loadingCardinales ? (
                <IonRow className="deliveryOrderMethod deliveryORderTop2">
                  Cargando fechas disponibles
                </IonRow>
              ) : (
                <div>
                  {formData.isDelivery && (
                    <IonRow
                      className="deliveryOrderMethod deliveryORderTop2"
                      style={{
                        visibility:
                          dayjs(days[0].txt).format("DD/MMM") ===
                          dayjs().format("DD/MMM")
                            ? "hidden"
                            : "visible",
                      }}
                    >
                      Fecha
                    </IonRow>
                  )}
                  {formData.isDelivery && (
                    <IonRow className="deliveryORderTop2">
                      <IonCol className="ion-text-center paddingTop " size="12">
                        <IonSlides
                          pager={false}
                          className=""
                          options={slideOpts}
                        >
                          {console.info("daysdaysdays", days)}
                          {days.map((day: any, i: number) => (
                            <IonSlide
                              key={i}
                              className={""}
                              style={{
                                visibility:
                                  dayjs(day.txt).format("DD/MMM") ===
                                  dayjs().format("DD/MMM")
                                    ? "hidden"
                                    : "visible",
                              }}
                            >
                              <div
                                key={i}
                                className={
                                  formData.date === day.txt
                                    ? "deliveryOrderDays2 deliveryOrderSelected"
                                    : "deliveryOrderDays2 "
                                }
                                onClick={() => setOnlyDay(day)}
                              >
                                {dayjs(day.txt).format("ddd")} <br />
                                {dayjs(day.txt).format("DD/MMM")}
                              </div>
                            </IonSlide>
                          ))}
                        </IonSlides>
                      </IonCol>
                    </IonRow>
                  )}
                </div>
              )}

              {/*
              <IonRow className="deliveryOrderMethod deliveryORderTop2">
                Hora
              </IonRow>
              <IonRow className="deliveryORderTop2">
                <IonCol className="ion-text-center paddingTop " size="12">
                  {hours.length > 0 && (
                    <IonSlides pager={false} className="" options={slideOpts}>
                      {hours.map((time: any, i: number) => (
                        <IonSlide
                          key={i}
                          className={time.hidden ? "deliveryOrdenHidden" : ""}
                        >
                          <div
                            key={i}
                            className={
                              formData.time === time
                                ? "deliveryOrderDays deliveryOrderSelected"
                                : "deliveryOrderDays  "
                            }
                            onClick={() =>
                              setFormData({
                                ...formData,
                                time: time,
                              })
                            }
                          >
                            {time.txt}
                          </div>
                        </IonSlide>
                      ))}
                    </IonSlides>
                  )}
                </IonCol>
              </IonRow>

*/}
            </IonGrid>

            <IonButton
              className="loginMarginTop21 loginBtn deliveryOrderSiguiente"
              onClick={() => preSetDelivery(false)}
            >
              <IonImg className="icon02" src={NEXT} slot="start" />
              Siguiente
            </IonButton>
          </div>
        ) : (
          <div>
            <div className="preOrderTop1">
              <div className="preOrderTop">
                <CardOrderProduct
                  data={(order || {}).orderItems}
                  setTotal={setTotales}
                  total={totales}
                  final={true}
                  userRetencion={userRetencion ? true : false}
                />
              </div>
            </div>

            <div className="deliveryOrderTotales">
              <div>
                <IonGrid>
                  <IonRow>
                    <IonCol size={"6"} className="ion-text-left deliveryOrder1">
                      Sub-Total
                    </IonCol>
                    <IonCol
                      size={"6"}
                      className="ion-text-right deliveryOrder2"
                    >
                      <NumberFormat
                        prefix="$"
                        thousandSeparator="."
                        decimalSeparator=","
                        value={totales.subTotal}
                        displayType={"text"}
                        decimalScale={0}
                      />
                    </IonCol>

                    {totales.ahorro > 0 && (
                      <IonCol
                        size={"6"}
                        className="ion-text-left preOrderAhorro"
                      >
                        Ahorro
                      </IonCol>
                    )}
                    {totales.ahorro > 0 && (
                      <IonCol
                        size={"6"}
                        className="ion-text-right preOrderAhorro"
                      >
                        <NumberFormat
                          prefix="$"
                          thousandSeparator="."
                          decimalSeparator=","
                          value={totales.ahorro}
                          displayType={"text"}
                          decimalScale={0}
                        />
                      </IonCol>
                    )}
                    {totales.retencion > 0 && (
                      <IonCol
                        size={"6"}
                        className="ion-text-left preOrderAhorro"
                      >
                        Retención
                      </IonCol>
                    )}
                    {totales.retencion > 0 && (
                      <IonCol
                        size={"6"}
                        className="ion-text-right preOrderAhorro"
                      >
                        <NumberFormat
                          prefix="$"
                          thousandSeparator="."
                          decimalSeparator=","
                          value={totales.retencion}
                          displayType={"text"}
                          decimalScale={0}
                        />
                      </IonCol>
                    )}
                    {/*<IonCol size={"6"} className="ion-text-left deliveryOrder1">
                      Método de Pago
                    </IonCol>
                    <IonCol
                      size={"6"}
                      className="ion-text-right deliveryOrder2"
                    >
                      {formData.paymentMethod}
                    </IonCol>
                    */}
                    <IonCol size={"6"} className="ion-text-left deliveryOrder1">
                      Metodo de entrega
                    </IonCol>
                    <IonCol
                      size={"6"}
                      className="ion-text-right deliveryOrder2"
                    >
                      {formData.isDelivery
                        ? "Domicilio"
                        : "Recoge en punto de venta"}
                    </IonCol>

                    <IonCol size={"6"} className="ion-text-left deliveryOrder1">
                      Costo de envío
                    </IonCol>

                    <IonCol
                      size={"6"}
                      className="ion-text-right deliveryOrder1"
                    >
                      <NumberFormat
                        prefix="$"
                        thousandSeparator="."
                        decimalSeparator=","
                        value={totales.flete}
                        displayType={"text"}
                        decimalScale={0}
                      />
                    </IonCol>

                    <IonCol size={"6"} className="ion-text-left deliveryOrder1">
                      Tienda
                    </IonCol>
                    <IonCol
                      size={"6"}
                      className="ion-text-right deliveryOrder2"
                    >
                      {formData.idStore
                        ? stores[
                            stores.findIndex(
                              (store: any) => store.id === formData.idStore
                            )
                          ].name
                        : ""}
                    </IonCol>

                    {formData.isDelivery && (
                      <IonCol
                        size={"6"}
                        className="ion-text-left deliveryOrder1"
                      >
                        Fecha
                      </IonCol>
                    )}
                    {formData.isDelivery && (
                      <IonCol
                        size={"6"}
                        className="ion-text-right deliveryOrder2"
                      >
                        {formData.date.format("DD MMM") +
                          "   " +
                          formData.time.txt}
                      </IonCol>
                    )}

                    <IonCol size={"6"} className="ion-text-left deliveryOrder1">
                      Puntos SanApp
                    </IonCol>
                    <IonCol
                      size={"6"}
                      className="ion-text-right deliveryOrder2"
                    >
                      {totales.puntos}
                    </IonCol>

                    <IonCol size={"6"} className="ion-text-left deliveryOrder3">
                      Total
                    </IonCol>
                    <IonCol
                      size={"6"}
                      className="ion-text-right deliveryOrder3"
                    >
                      <NumberFormat
                        prefix="$"
                        thousandSeparator="."
                        decimalSeparator=","
                        value={totales.total + totales.flete}
                        displayType={"text"}
                        decimalScale={0}
                      />
                    </IonCol>
                  </IonRow>
                </IonGrid>

                <IonButton className="preOrderToOrder" onClick={() => Save()}>
                  <IonImg className="icon02" src={NEXT} slot="start" />
                  Confirmar Pedido
                </IonButton>
              </div>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default DeliveryOrders;