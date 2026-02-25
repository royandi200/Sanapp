import React, { useContext, useEffect, useState } from "react";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonPopover,
  IonSlides,
  IonSlide,
  IonModal,
  IonSkeletonText,
  IonRippleEffect,
  IonImg,
  IonButton,
  IonBackdrop,
  IonContent,
} from "@ionic/react";

import "./Card.css";

import {
  CBB,
  BACK,
  NEXT,
  SOPORTEADJUNTAR,
  //TIMER,
  FLECHASUBCAT,
  //TAB4,
} from "../../const/imgs";

import NumberFormat from "react-number-format";
import {
  AddProductOrder,
  spliceTxt,
  completeCodigo,
  TYPE,
  IVA,
} from "../../const/functions";
import { takePicture } from "../Inputs/Input";

//import Countdown from "react-countdown-now";

import dayjs from "dayjs";
import "dayjs/locale/es"; // load on demand
import InfoContext from "../../context/InfoContext";
import { Confirm } from "../Alert/Alert";
dayjs.locale("es");

export interface CardProps {
  loading: boolean;
}

export interface PropCard {
  data: any;
  onClick: Function;
  setData?: Function;
  selectPresentation?: Function;
  indiceCategory?: any;
  indiceProducto?: number;
  loading?: boolean;
  allData?: any[];
  newRender?: Function;
  fast?: boolean;
  showDetailProd?: boolean;
  setdataProductModifiy?: any;
  dataProductModifiy?: any;
  productoDeepLink?: any;
  productPreSelected?: any;
  setProductPreSelected?: any;
}

interface CardDetailProd {
  product: any;
  back: Function;
  suggested?: any[];
  allData: any[];
  setData?: Function;
  newRender?: Function;
}

interface CardOrderProduct {
  data: any[];
  setTotal: Function;
  total: any;
  final?: boolean;
  userRetencion?: boolean;
}

interface CardPromotion {
  data: any[];
  render: boolean;
  setRender: Function;
}

export function CardCatalogue({ data, onClick, loading }: PropCard) {
  return (
    <div>
      {loading && (
        <div>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((obj: any) => {
            return (
              <div key={obj}>
                <IonSkeletonText animated className="cardCatalogue0" />
              </div>
            );
          })}
        </div>
      )}

      {!loading && (
        <div>
          {(data || []).map((obj: any, ind: number) => {
            return (
              <div key={obj.id}>
                <div className={"cardCatalogue"} onClick={() => onClick(obj)}>
                  <img src={obj.img} alt={""} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function CardProduct({
  data,
  onClick,
  selectPresentation,
  indiceCategory,
  indiceProducto,
  loading,
  allData = [],
  setData,
  newRender,
  fast = false,
  showDetailProd = false,
  setdataProductModifiy,
  dataProductModifiy,
  productoDeepLink,
  productPreSelected,
  setProductPreSelected,
}: PropCard) {
  const [showPopoverProduct, setShowPopoverProduct] = useState(false);
  const [render, setRender] = useState(false);
  const [modalProduct, setModalProduct] = useState(false);
  const [productSelected, setProductSelected] = useState(false);
  const [suggested, setSuggested] = useState<any>([]);
  //const { setPetition }  = useContext<any>(InfoContext)
  //const { products, setProducts }  = useContext<any>(InfoContext)

  useEffect(() => {
    if (productoDeepLink) {
      if (data.id === productoDeepLink.id) {
        setModalProduct(false);
        goProduct(productoDeepLink);
      }
    }
  }, [productoDeepLink, data]);

  useEffect(() => {
    console.info("productPreSelected", productPreSelected);
    if (productPreSelected) {
      if (data.id === productPreSelected.id) {
        setModalProduct(false);
        goProduct(productPreSelected);
        setProductPreSelected(null);
      }
    }
  }, [productPreSelected]);

  const goProduct = (product: any) => {
    console.info("ir al producto...");
    if (fast && !showDetailProd) return;
    const newSuggested: any = [];

    allData[indiceCategory.type.name].forEach((element: any) => {
      if (element.suggested) newSuggested.push(element);
    });

    setSuggested(newSuggested);

    setProductSelected(product);
    console.info("modalProduct", modalProduct)
    if (!modalProduct) {
      setModalProduct(true);
    }
  };
  //ESTE ES EL Q IMPLEMENTO EL ADD FULL
  const add = (obj: any) => {
    const presentation = obj.presentations[obj.selectedIndPresentation || 0];
    const max =
      presentation.existence > obj.orderQuantity
        ? obj.orderQuantity
        : presentation.existence;
    if (max === presentation.quantity) return;
    presentation.quantity = presentation.quantity ? presentation.quantity : 0;
    presentation.quantity += 1;
    //AddProductOrder(obj, 0, false, setPetition);
    //console.info("[ ...dataProductModifiy, obj]", [ ...dataProductModifiy.dataModifify, obj])
    console.info("cambio  a true data producto modifiy");
    setdataProductModifiy(true);
    setRender(!render);
  };

  const dismount = (obj: any) => {
    const presentation = obj.presentations[obj.selectedIndPresentation || 0];
    presentation.quantity = presentation.quantity ? presentation.quantity : 0;
    if (presentation.quantity === 0) return;
    presentation.quantity -= 1;
    //setdataProductModifiy([...dataProductModifiy, obj])
    //AddProductOrder(obj, 0, false, setPetition);
    setdataProductModifiy(true);
    setRender(!render);
  };

  return (
    <div className={fast ? "" : "cardProduct"}>
      <IonModal
        isOpen={modalProduct}
        onDidDismiss={() => setModalProduct(false)}
      >
        <CardDetailProduct
          product={productSelected}
          back={() => {
            setModalProduct(false);
            setRender(!render);
          }}
          suggested={suggested}
          allData={allData}
          setData={setData}
          newRender={() => (newRender ? newRender() : {})}
        />
      </IonModal>
      <div>
        <div
          className="cardProducTxt ion-text-center sshadow"
          onClick={() => goProduct(data)}
        >
          <NumberFormat
            prefix="$"
            thousandSeparator="."
            decimalSeparator=","
            value={data.presentations[data.selectedIndPresentation || 0].price}
            displayType={"text"}
            decimalScale={0}
          />
        </div>

        <div
          className="cardProducImg "
          style={{ backgroundImage: 'url("' + data.img + '")' }}
        >

          <IonModal
            cssClass={"pirela"}
            isOpen={showPopoverProduct}
            //onDidDismiss={(e) => setShowPopoverProduct(false)}
            backdropDismiss
            onWillDismiss={(e) => setShowPopoverProduct(false)}
          >
            <IonContent>
              {data.presentations.map((obj: any, indPresentation: number) => (
                <div
                  style={{}}
                  key={indPresentation}
                  onClick={() => {
                    fast
                      ? selectPresentation &&
                        selectPresentation(
                          data,
                          indPresentation,
                          setShowPopoverProduct
                        )
                      : selectPresentation &&
                        selectPresentation(
                          indPresentation,
                          indiceCategory,
                          data,
                          indiceProducto,
                          setShowPopoverProduct,
                          showPopoverProduct
                        );
                  }}
                >
                  <IonGrid>
                    <IonRow className="presentatioRow">
                      <IonCol size={"12"}>{obj.detail}</IonCol>
                    </IonRow>
                  </IonGrid>
                </div>
              ))}
            </IonContent>
          </IonModal>

          <div
            className="cbbPresentation2 cbbOpracity cbbTop ion-text-center"
            onClick={() => setShowPopoverProduct(true)}
          >
            {spliceTxt(
              data.presentations[data.selectedIndPresentation || 0].detail,
              7
            )}
            <IonImg className={"cbbIcon"} src={CBB} />
          </div>

          <div className="cbbMarginTop" onClick={() => goProduct(data)}></div>

          <div className="cbbPresentation ion-text-center cbbOpracity">
            <IonGrid className={"cardValores"}>
              <IonRow className="ion-text-center cardRow">
                <IonCol
                  size={"3"}
                  className={"cardValue "}
                  onClick={() => dismount(data)}
                >
                  <div>
                    <div className="ion-activatable ripple-parent">
                      <IonRippleEffect className=""></IonRippleEffect>-
                    </div>
                  </div>
                </IonCol>
                <IonCol size={"6"} className={"cardValueQuantity"}>
                  {data.presentations[data.selectedIndPresentation || 0]
                    .quantity || 0}
                </IonCol>
                <IonCol
                  size={"3"}
                  className={"cardValue"}
                  onClick={(e) => add(data)}
                >
                  <div>
                    <div className="ion-activatable ripple-parent">
                      <IonRippleEffect className=""></IonRippleEffect>+
                    </div>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
        </div>
      </div>

      <div onClick={() => goProduct(data)}>
        <div className="cardProducTxt3 max16 ion-text-center">
          {spliceTxt(data.name, 13)}
        </div>
        <div className="cardProducTxt4 ion-text-center">{data.content}</div>
      </div>
    </div>
  );
}
//listado de categoria...
export function CardCategories({
  data,
  onClick,
  setData,
  loading,
  newRender,
  setdataProductModifiy,
  dataProductModifiy,
  productoDeepLink,
}: PropCard) {
  const changeData = (
    indPresentation: number,
    indCategory: any,
    daaata: any,
    indProducto: any,
    setShowPopoverCategories: any,
    showPopoverCategories: any
  ) => {
    data[indCategory.type.name][indProducto].selectedIndPresentation =
      indPresentation;
    setShowPopoverCategories(false);
  };

  const slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 3.2,
  };

  return (
    <div>
      {loading && (
        <div>
          <div>
            <IonSkeletonText animated className="subCategory cardSubTxt " />
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((obj: any) => {
              return (
                <div key={obj}>
                  <IonSkeletonText animated className="cardSkeleton1" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!loading &&
        (Object.keys(data) || []).map((obj: any, ind: any) => {
          return (
            <div className={"subCategory"} key={ind}>
              <div className={"cardSubTxt "}>
                <div>
                  <div className={"leef"}>{obj}</div>

                  <div>
                    <IonImg
                      src={FLECHASUBCAT}
                      className=" flechaSubCat leef "
                    />
                  </div>
                </div>
              </div>

              <div className={"clearr"}>
                <IonSlides pager={false} className="ttt" options={slideOpts}>
                  {data[obj].map((obj: any, i: number) => (
                    <IonSlide key={(ind + 1) * (i + 1)} className={""}>
                      <div key={i}>
                        <CardProduct
                          data={obj}
                          indiceCategory={obj}
                          indiceProducto={i}
                          onClick={(a: any) => onClick && onClick(a)}
                          selectPresentation={changeData}
                          allData={data}
                          setData={setData}
                          dataProductModifiy={dataProductModifiy}
                          setdataProductModifiy={setdataProductModifiy}
                          newRender={newRender}
                          productoDeepLink={productoDeepLink}
                        />
                      </div>
                    </IonSlide>
                  ))}
                </IonSlides>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export function CardDetailProduct({
  product,
  back,
  suggested = [],
  allData,
  setData,
  newRender,
}: CardDetailProd) {
  const [showPopoverDetailProduct, setShowPopoverDetailProduct] =
    useState(false);
  const [showPopoverSuggested, setShowPopoverSuggested] = useState(false);

  const [render, setRender] = useState(false);

  const [sug, setSug] = useState<any>([]);
  const [sugSelected, setSugSelected] = useState<any>({});

  const { setPetition } = useContext<any>(InfoContext);

  const add = (obj: any, suggested: boolean = false) => {
    const presentation = obj.presentations[obj.selectedIndPresentation || 0];
    const max =
      presentation.existence > obj.orderQuantity
        ? obj.orderQuantity
        : presentation.existence;
    if (max === presentation.quantity) return;
    presentation.quantity = presentation.quantity ? presentation.quantity : 0;
    presentation.quantity += 1;
    AddProductOrder(obj, 0, false, setPetition);
    if (suggested) {
      const i = allData[product.type.name].findIndex(
        (element: any) => element.id === obj.id
      );
      allData[product.type.name][i] = obj;
      newRender && newRender();
    }
    setRender(!render);
  };

  const dismount = (obj: any) => {
    const presentation = obj.presentations[obj.selectedIndPresentation || 0];
    presentation.quantity = presentation.quantity ? presentation.quantity : 0;
    if (presentation.quantity === 0) return;
    presentation.quantity -= 1;
    AddProductOrder(obj, 0, false, setPetition);
    if (suggested) {
      const i = allData[product.type.name].findIndex(
        (element: any) => element.id === obj.id
      );
      allData[product.type.name][i] = obj;
      newRender && newRender();
    }
    setRender(!render);
  };

  const changePresentation = (indPresentation: number) => {
    product.selectedIndPresentation = indPresentation; //product.presentations[indPresentation].detail
    setShowPopoverDetailProduct(false);
    setRender(!render);
  };

  const i = suggested.findIndex((obj: any) => obj.id === product.id);
  let newSuggested = [];

  if (!sug.length) {
    if (i > -1) suggested.splice(i, 1);

    for (let i = 0; i < 3; i++) {
      const x = Math.floor(Math.random() * (suggested.length - 1));
      newSuggested.push(suggested[x]);
      suggested.splice(x, 1);
    }

    setSug(newSuggested);
  }

  return (
    <div>
      <IonModal
        cssClass={"pirela"}
        backdropDismiss
        onWillDismiss={(e) => setShowPopoverDetailProduct(false)}
        isOpen={showPopoverDetailProduct}
        onDidDismiss={(e) => setShowPopoverDetailProduct(false)}
      >
        <IonContent>
          {product.presentations.map((obj: any, indPresentation: number) => (
            <div
              key={indPresentation}
              onClick={() => {
                changePresentation(indPresentation);
              }}
            >
              <IonGrid>
                <IonRow className="presentatioRow">
                  <IonCol size={"12"}>{obj.detail}</IonCol>
                </IonRow>
              </IonGrid>
            </div>
          ))}
        </IonContent>
      </IonModal>

      <IonGrid className="cardProdDetTop">
        <IonRow>
          <IonCol
            size={"1"}
            onClick={() => {
              back();
            }}
          >
            <IonImg className="cardBackProdDet" src={BACK} />
          </IonCol>
          <IonCol
            size={"11"}
            className="ion-text-center fontmilkshake productDetTxt1"
          ></IonCol>
        </IonRow>
      </IonGrid>

      <div className="ion-text-center productDetTxt4">
        <NumberFormat
          prefix="$"
          thousandSeparator="."
          decimalSeparator=","
          value={
            product.presentations[product.selectedIndPresentation || 0].price
          }
          displayType={"text"}
          decimalScale={0}
        />
      </div>

      <div
        className="cardDetailProductImg"
        style={{ backgroundImage: 'url("' + product.img + '")' }}
      >
        <div
          className="cbbPresentationDet2 cbbOpracity  cbbTopDet ion-text-center"
          onClick={() => setShowPopoverDetailProduct(true)}
        >
          {product.presentations[product.selectedIndPresentation || 0].detail}
          <IonImg className={"cbbIcon2"} src={CBB} />
        </div>

        <div className="cardProductDetTop"></div>

        <div className="cbbPresentationDet cbbOpracity ion-text-center">
          <IonGrid className={"cardValoresDet"}>
            <IonRow className="ion-text-center cardRow">
              <IonCol
                size={"2"}
                className={"cardValueDet"}
                onClick={() => dismount(product)}
              >
                <div>
                  <div className="ion-activatable ripple-parent">
                    <IonRippleEffect className=""></IonRippleEffect>-
                  </div>
                </div>
              </IonCol>
              <IonCol size={"8"} className={"cardValueDet"}>
                {product.presentations[product.selectedIndPresentation || 0]
                  .quantity || 0}
              </IonCol>
              <IonCol
                size={"2"}
                className={"cardValueDet ion-activatable ripple-parent"}
                onClick={() => add(product)}
              >
                <div>
                  <div className="ion-activatable ripple-parent">
                    <IonRippleEffect className=""></IonRippleEffect>+
                  </div>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </div>

      <div className={"cardProductDetName22 ion-text-center"}>
        {product.name}
      </div>

      <div className="ion-text-center cardProdDetTop productDetTxt2">
        {product.content}
      </div>

      <div className="divSugerido">
        <IonModal
          cssClass={"pirela"}
          backdropDismiss
          onWillDismiss={(e) => setShowPopoverSuggested(false)}
          isOpen={showPopoverSuggested}
          onDidDismiss={(e) => setShowPopoverSuggested(false)}
        >
          <IonContent>
            {(sugSelected.presentations || []).map(
              (obj: any, indPresentation: number) => (
                <div key={indPresentation}>
                  <IonGrid>
                    <IonRow
                      className="presentatioRow"
                      onClick={() => {
                        sugSelected.selectedIndPresentation = indPresentation;
                        setShowPopoverSuggested(false);
                      }}
                    >
                      <IonCol size={"12"}>{obj.detail}</IonCol>
                    </IonRow>
                  </IonGrid>
                </div>
              )
            )}
          </IonContent>
        </IonModal>

        <div className="">
          {sug.map((obj: any, indSuggested: number) =>
            obj
              ? obj.id !== product.id && (
                  <div key={indSuggested} className="sugerido">
                    <div className="cardProducTxt ion-text-center">
                      <NumberFormat
                        prefix="$"
                        thousandSeparator="."
                        decimalSeparator=","
                        value={
                          obj.presentations[obj.selectedIndPresentation || 0]
                            .price
                        }
                        displayType={"text"}
                        decimalScale={0}
                      />
                    </div>

                    <div
                      className="cardProducImg "
                      style={{ backgroundImage: 'url("' + obj.img + '")' }}
                    >
                      <div
                        className="cbbPresentation2 cbbOpracity cbbTop ion-text-center"
                        onClick={() => {
                          setSugSelected(obj);
                          setShowPopoverSuggested(true);
                        }}
                      >
                        {
                          obj.presentations[obj.selectedIndPresentation || 0]
                            .detail
                        }
                        <IonImg className={"cbbIcon"} src={CBB} />
                      </div>

                      <div className="cbbMarginTop"></div>

                      <div className="cbbPresentation ion-text-center cbbOpracity">
                        <IonGrid className={"cardValores"}>
                          <IonRow className="ion-text-center cardRow">
                            <IonCol
                              size={"3"}
                              className={"cardValue "}
                              onClick={() => dismount(obj)}
                            >
                              <div>
                                <div className="ion-activatable ripple-parent">
                                  <IonRippleEffect className=""></IonRippleEffect>
                                  -
                                </div>
                              </div>
                            </IonCol>
                            <IonCol size={"6"} className={"cardValue"}>
                              {obj.presentations[
                                obj.selectedIndPresentation || 0
                              ].quantity || 0}
                            </IonCol>
                            <IonCol
                              size={"3"}
                              className={"cardValue"}
                              onClick={(e) => add(obj, true)}
                            >
                              <div>
                                <div className="ion-activatable ripple-parent">
                                  <IonRippleEffect className=""></IonRippleEffect>
                                  +
                                </div>
                              </div>
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      </div>
                    </div>
                    <div>
                      <div className="cardProducTxt01 ion-text-center">
                        {obj.name}
                      </div>
                      <div className="cardProducTxt02 ion-text-center">
                        {obj.content}
                      </div>
                    </div>
                  </div>
                )
              : ""
          )}
        </div>

        <div className="ion-text-center fontmilkshake txtSugerido">
          Sugeridos para ti !
        </div>
      </div>
    </div>
  );
}

export function CardOrderProduct({
  data = [],
  setTotal,
  total,
  final = false,
  userRetencion,
}: CardOrderProduct) {
  const [render, setRender] = useState(false);
  const { setPetition } = useContext<any>(InfoContext);

  const calcTotales = () => {
    let total = 0,
      subTotal = 0,
      retencion = 0,
      ahorro = 0;

    data.forEach((item: any) => {
      if (item.idProduct) subTotal += item.presentation.price * item.quantity;
      if (item.idPromotion) {
        subTotal += item.promotion.price * item.quantity;
        ahorro += item.promotion.discount * item.quantity;
      }
    });

    if (userRetencion) {
      retencion = (subTotal - ahorro) * IVA;
    }
    total = subTotal - ahorro - retencion;

    setTotal({
      total,
      ahorro,
      retencion,
      subTotal,
    });
  };

  const add = (obj: any) => {
    const isPromo = obj.promotion;

    if (isPromo) {
      if (obj.quantity === obj.promotion.orderQuantity) {
        return;
      }
    } else {
      const max =
        obj.presentation.existence > obj.product.orderQuantity
          ? obj.product.orderQuantity
          : obj.presentation.existence;
      if (obj.quantity === max) {
        return;
      }
    }

    obj.quantity += 1;
    if (isPromo) obj.idPromotion = obj.promotion.id;
    AddProductOrder(obj, 0, isPromo, setPetition);
    calcTotales();
    setRender(!render);
  };

  const dismount = (obj: any) => {
    if (obj.quantity === 0) return;
    obj.quantity -= 1;
    if (obj.quantity === 0) {
      const i = data.findIndex((item: any) => item.id === obj.id);
      data.splice(i, 1);
    }
    const isPromo = obj.promotion;
    if (isPromo) obj.idPromotion = obj.promotion.id;
    AddProductOrder(obj, 0, isPromo, setPetition);
    calcTotales();
    setRender(!render);
  };

  const img = data.length ? true : false;

  return (
    <div>
      {data.map((orderItem: any, ind: any) => (
        <div className={"cardOrderProductBack"} key={ind}>
          {
            //console.info("orderItem.promotion --", orderItem, orderItem.promotion, orderItem.promotion)
          }
          <div
            className={"cardOrderProductImg CardOrderProductLeft"}
            style={{
              backgroundImage:
                'url("' +
                (orderItem.idPromotion
                  ? orderItem.promotion.imgVertical
                  : orderItem.product.img) +
                '")',
              width: "12vw",
              marginLeft: "8px",
            }}
          ></div>

          <div className={"cardOrderProduct30 CardOrderProductLeft "}>
            <div className={"cardOrderProductName"}>
              {orderItem.idPromotion
                ? spliceTxt(orderItem.promotion.name, 30)
                : spliceTxt(orderItem.product.name, 30)}
            </div>
            {orderItem.idProduct && (
              <div
                className={"cardOrderProductPresentation cardOrderProductPrice"}
              >
                {orderItem.product.content}
              </div>
            )}

            <div
              className={"cardOrderProductPresentation cardOrderProductPrice"}
            >
              {orderItem.idPromotion
                ? spliceTxt(orderItem.promotion.description, 40)
                : spliceTxt(orderItem.presentation.detail, 40)}
            </div>
          </div>

          <div className={"cardOrderProduct20 CardOrderProductLeft "}>
            {!final && (
              <div className={"cardOrderProductBack2 "}>
                <IonGrid className={"cardValores "}>
                  <IonRow className="ion-text-center cardRow ">
                    <IonCol
                      size={"3"}
                      className={"cardProductValue "}
                      onClick={() => dismount(orderItem)}
                    >
                      <div>
                        <div className="ion-activatable ripple-parent">
                          <IonRippleEffect className=""></IonRippleEffect>-
                        </div>
                      </div>
                    </IonCol>
                    <IonCol size={"6"} className={"cardProductValue"}>
                      {orderItem.quantity || 0}
                    </IonCol>
                    <IonCol
                      size={"3"}
                      className={"cardProductValue"}
                      onClick={() => add(orderItem)}
                    >
                      <div>
                        <div className="ion-activatable ripple-parent">
                          <IonRippleEffect className=""></IonRippleEffect>+
                        </div>
                      </div>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </div>
            )}
            <div
              className={
                !final
                  ? "ion-text-center cardOrderProductName cardOrderProductPrice"
                  : "ion-text-center cardOrderProductName cardOrderProductPrice2"
              }
            >
              {final && <div>cant: {orderItem.quantity}</div>}
              <NumberFormat
                prefix="$"
                thousandSeparator="."
                decimalSeparator=","
                value={
                  img
                    ? orderItem.idPromotion
                      ? orderItem.promotion.price * orderItem.quantity || 0
                      : orderItem.presentation.price * orderItem.quantity || 0
                    : 0
                }
                displayType={"text"}
                decimalScale={0}
              />
            </div>
            {orderItem.idPromotion && (
              <div
                className={
                  !final
                    ? "ion-text-center cardOrderProductName cardOrderProductPrice cardPromotionDiscount"
                    : "ion-text-center cardOrderProductName cardOrderProductPrice cardPromotionDiscount2"
                }
              >
                <NumberFormat
                  prefix="$"
                  thousandSeparator="."
                  decimalSeparator=","
                  value={
                    img ? orderItem.promotion.discount * orderItem.quantity : 0
                  }
                  displayType={"text"}
                  decimalScale={0}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardPromotion({ data = [], render, setRender }: CardPromotion) {
  const { setPetition } = useContext<any>(InfoContext);

  const add = (obj: any) => {
    if (obj.quantity === obj.orderQuantity) return;
    obj.quantity = obj.quantity ? obj.quantity + 1 : 1;
    AddProductOrder(obj, 0, true, setPetition);
    setRender(!render);
  };

  const dismount = (obj: any) => {
    if (obj.quantity === 0) return;
    obj.quantity -= 1;
    AddProductOrder(obj, 0, true, setPetition);

    setRender(!render);
  };

  return (
    <div className="">
      {data.map((promotion: any, indice: number) => {
        return (
          <div key={indice} className="cardPromotion">
            <div
              className="cardPromotionImg"
              style={{ backgroundImage: 'url("' + promotion.img + '")' }}
            >
              <div>
                <div className="cardPromotionPriceTop"></div>
                <div className="cardPromotionPrice ion-text-center">
                  <div className="cardPromotionActPrice">
                    <NumberFormat
                      prefix="$"
                      thousandSeparator="."
                      decimalSeparator=","
                      value={promotion.price}
                      displayType={"text"}
                      decimalScale={0}
                    />
                  </div>
                  {/*
                  <div className="cardPromotionOriginalPrice">
                    <NumberFormat
                      prefix="Antes $"
                      thousandSeparator="."
                      decimalSeparator=","
                      value={promotion.price + promotion.discount}
                      displayType={"text"}
                      decimalScale={0}
                    />
                  </div>
                  */}
                  <div className="cardPromotionAhorro">
                    <NumberFormat
                      prefix="Ahorro $"
                      thousandSeparator="."
                      decimalSeparator=","
                      value={promotion.discount}
                      displayType={"text"}
                      decimalScale={0}
                    />
                  </div>
                </div>

                <div id="container">
                  <div></div>
                </div>
              </div>
            </div>

            <div className="cardPromotionBottom">
              <IonGrid>
                <IonRow>
                  <IonCol size={"7"} className="cardPromotionTxt1">
                    {promotion.name}
                  </IonCol>
                  <IonCol size={"5"}>
                    <IonGrid>
                      <IonRow>
                        <IonCol size={"3"} className="ion-text-center">
                          <div className="cardPromotionCircle cardPromotionCircleTop">
                            <div
                              className="ion-activatable ripple-parent"
                              onClick={() => dismount(promotion)}
                            >
                              <IonRippleEffect className="rippleCircle"></IonRippleEffect>
                              -
                            </div>
                          </div>
                        </IonCol>
                        <IonCol
                          size={"6"}
                          className="ion-text-center cardPromotionCircleTop cardPromotionCantidad"
                        >
                          {promotion.quantity || 0}
                        </IonCol>
                        <IonCol size={"3"} className="ion-text-center">
                          <div className="cardPromotionCircle cardPromotionCircleTop">
                            <div
                              className="ion-activatable ripple-parent cardPromotionMas"
                              onClick={() => add(promotion)}
                            >
                              <IonRippleEffect className="rippleCircle"></IonRippleEffect>
                              +
                            </div>
                          </div>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol className="cardPromotionTxt2" size="12">
                    {promotion.description}
                    <div className="cardPromotionTxt3">
                      {promotion.politica}
                    </div>
                  </IonCol>

                  <IonCol className="cardPromotionTxt3" size="12"></IonCol>
                </IonRow>
              </IonGrid>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CardFastOrder({
  data = [],
  render,
  setRender,
  allData = [],
  fast = true,
  showDetailProd = false,
  setdataProductModifiy,
  productPreSelected,
  setProductPreSelected,
}: any) {
  const changeData2 = (
    obj: any,
    indPresentation: number,
    showPopover: Function
  ) => {
    obj.selectedIndPresentation = indPresentation;
    setRender(!render);
    showPopover(false);
  };

  return (
    <IonGrid className={""}>
      <IonRow>
        <br />
        <br />
      </IonRow>
      <IonRow>
        {data.map((obj: any, i: number) => (
          <IonCol size={"4"} key={i}>
            <CardProduct
              data={obj}
              indiceCategory={obj}
              indiceProducto={i}
              onClick={(a: any) => {}}
              selectPresentation={changeData2}
              allData={allData}
              setData={() => {}}
              newRender={() => setRender()}
              fast={fast}
              showDetailProd={showDetailProd}
              setdataProductModifiy={setdataProductModifiy}
              productPreSelected={productPreSelected}
              setProductPreSelected={setProductPreSelected}
            />
          </IonCol>
        ))}
      </IonRow>
      <IonRow>
        <br />
        <br />
        <br />
        <br />
      </IonRow>
    </IonGrid>
  );
}

export function CardVoucher({ data = [], save, showSave }: any) {
  const [render, setRender] = useState(false);

  let t = JSON.stringify(data);
  let newData = [...JSON.parse(t)];

  newData.forEach((element: any) => {
    element.promisedDeliveryDate = dayjs(element.promisedDeliveryDate);
  });

  const getImg = (obj: any) => {
    takePicture().then((img) => {
      obj.support = img;
      setRender(!render);
    });
  };
  /*
  const renderer = ({ days, hours, minutes }: any) => (
    <span>
      {" "}
      {hours + 24 * days > 9 ? hours + 24 * days : "" + " " + hours + 24 * days}
      :{minutes > 9 ? minutes : 0 + "" + minutes}
    </span>
  );

  const horaEntrega = (horaEntrega: any) => dayjs(horaEntrega).add(-2, "h");
  */
  return (
    <div className={""}>
      {data.map((obj: any, i: number) => (
        <div key={i}>
          <div>
            {obj.idPaymentMethod === TYPE.CONSIGNACION &&
              (obj.idStatus === TYPE.PENDIENTE ||
                TYPE.VALIDANDO === obj.idStatus) && (
                <IonImg
                  onClick={() =>
                    showSave &&
                    obj.idPaymentMethod !== TYPE.CONTRAENTREGA &&
                    obj.idStatus === TYPE.PENDIENTE
                      ? getImg(obj)
                      : {}
                  }
                  src={obj.support ? obj.support : SOPORTEADJUNTAR}
                  className={"voucherValidar"}
                />
              )}

            {showSave &&
              obj.idPaymentMethod !== TYPE.CONTRAENTREGA &&
              obj.idStatus === TYPE.PENDIENTE && (
                <div className="ion-text-center circuloAdjuntar">
                  Presione el circulo para adjuntar el soporte
                </div>
              )}

            <div
              className={"voucherTime2"}
              style={{
                maxWidth: "40vw",
              }}
            />
            {/* (obj.idPaymentMethod === TYPE.CONTRAENTREGA ||
              obj.idStatus === TYPE.CONFIRMADO ||
              TYPE.ALISTADO === obj.idStatus) && (
              <div
                className={"voucherTime"}
                style={{
                  backgroundImage: 'url("' + TIMER + '")',
                  maxWidth: "80vw",
                }}
              >
                <div className="voucherTxtTime ion-text-center">
                  <Countdown
                    date={
                      dayjs().valueOf() +
                      dayjs(newData[i].promisedDeliveryDate)
                        .add(-2, "h")
                        .diff(dayjs())
                        .valueOf()
                    }
                    renderer={renderer}
                  />
                </div>
              </div>
              )*/}
            <br />
            <br />
            <div className="cardVoucherTxt1 ion-text-center">
              Orden confirmada
            </div>
            <div className="cardVoucherTxt1 ion-text-center">
              Su número de orden es
            </div>
            <div className="cardVoucherTxt2 ion-text-center">
              # {completeCodigo("" + obj.codigo)}
            </div>

            {(obj.idPaymentMethod === TYPE.CONTRAENTREGA ||
              obj.idStatus === TYPE.CONFIRMADO ||
              obj.idStatus === TYPE.CONFIRMADO ||
              TYPE.ALISTADO === obj.idStatus) && (
              <div className="ion-text-center">
                <div className="voucherDia">
                  {newData[i].promisedDeliveryDate.format("dddd, DD-MM-YYYY")}
                </div>
                {/*<div className="voucherHora">
                  {horaEntrega(newData[i].promisedDeliveryDate)
                    .add(0, "h")
                    .format("HH:mm")}
                </div>

                <div className="voucherHoraEntrega">Hora de entrega</div>
                */}
                <div className="voucherHoraEntrega2">
                  Programa tu pedido en la siguiente línea 3214690588
                </div>
              </div>
            )}
            <br />
            <br />
            {showSave &&
              obj.idPaymentMethod !== TYPE.CONTRAENTREGA &&
              obj.idStatus === TYPE.PENDIENTE && (
                //obj.idStatus === TYPE.PENDIENTE &&
                <IonButton
                  className="loginMarginTop21 loginBtn"
                  onClick={() => save(obj)}
                >
                  <IonImg
                    className="cardVoucherLeftIcon"
                    src={NEXT}
                    slot="end"
                  />
                  Guardar
                </IonButton>
              )}
            {obj.idStatus === TYPE.VALIDANDO && (
              <div className="loginMarginTop21 cardValidando ion-text-center">
                VALIDANDO
              </div>
            )}
            <br />
            <br />
            <br />
          </div>
        </div>
      ))}
      <div className="cardFastOrder"></div>
    </div>
  );
}
