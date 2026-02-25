import {
  IonContent,
  IonPage,
  IonLoading,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
} from "@ionic/react";

import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";

import InfoContext from "../../context/InfoContext";

import "./Catalogue.css";

import {
  //ICONPEDIDOCURSO,
  CERRARBUSCAR2,
  //BUSCARCATALOGO,
  CARPA,
  TAB4,
  LUPA,
  LOADINGCARRITO,
} from "../../const/imgs";

import { Input } from "../../components/Inputs/Input";
import { CardCatalogue, CardFastOrder } from "../../components/Cards/Card";
import { Tabs } from "../../components/Tabs/Tabs";

import { getProductSearchTxt, getType } from "../../api/type/type";
//import { needSupport } from "../../api/pedido/pedido";
import { getProductsSearch } from "../../api/type/type";
import { getAllNotificaction } from "../../api/notificacion/notificacion";

import { Toast } from "../../components/Alert/Alert";

import { Plugins, PushNotificationToken } from "@capacitor/core";
import { putUsu, getLocalUser, removeSesionData } from "../../api/user/user";
import { CustomCarousel } from "../../components/Carousel/Carousel";
import { CustomCarouselCaro } from "../../components/CarouselReco/CarouselReco";
import { getPromotionBanner } from "../../api/promotion/promotion";
import { AddProductOrderNEW } from "../../const/functions";
import { useLocation } from "react-router-dom";
import { SearchList } from "../../components/SearchList/SearchList";

const { PushNotifications } = Plugins;

const Catalogue: React.FC<any> = (props) => {
  const timerRef = useRef<NodeJS.Timeout | null | any>(null);

  const lll = useLocation();

  const [showLoading, setShowLoading] = useState(true);

  const [data, setData] = useState<any>([]);
  //const [curso, setCurso] = useState(0);
  const [useFetch, setUseFetch] = useState("");

  const [dataProductModifiy, setdataProductModifiy] = useState<any>(false);
  //console.log(`PIRELA catalogue props... ${JSON.stringify(props)}`)

  //console.log(`PIRELA catalogue props lll... ${JSON.stringify(lll)}`)

  const propFetch = props.location
    ? props.location.state
      ? props.location.state.fetch1
      : null
    : useFetch;

  const [dataSearch, setDataSearch] = useState<any>([]);
  const [allData_, setAllData_] = useState<any>([]);
  const [search, setSearch] = useState<any>("");

  const [dataPromotionBanner, setDataPromotionBanner] = useState([]);
  const [dataRecomendados, setDataRecomendados] = useState([]);

  const [render1, setRender1] = useState(true);

  const [toast, setToast] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const { first, setFirst, products, loadingCar, setLoadingCar } =
    useContext<any>(InfoContext);

  const [modalInformacion, setModalInformacion] = useState(first);

  const [dataNotification, setDataNotification] = useState<any>([]);

  const [results, setResults] = useState([]);

  const [isResultsLoading, setIsResultLoading] = useState(false);
  const [dataSearchTxt, setDataSearchTxt] = useState<any>([]);

  const [productPreSelected, setProductPreSelected] = useState<any>(null);

  //console.info("first", first)
  if (first) {
    setFirst(false);
  }

  if (propFetch !== useFetch && propFetch) {
    //console.info("propFetch", propFetch);
    setUseFetch(propFetch);
  }

  const fetchDataSearch = async (v: string) => {
    setShowLoading(true);
    const result = await getProductsSearch(v);

    const data = result.data;

    let newData: any[] = [];
    setAllData_(data);

    Object.keys(data).map(function (key, index) {
      data[key].map((obj: any) => {
        const filter = obj.name.toUpperCase() + " " + obj.content.toUpperCase();
        const words = v.toUpperCase().split(" ");
        //console.log("words", words)
        let flag = true;
        words.forEach((word: any, i: number) => {
          if (!flag) return;

          if (!filter.includes(word)) {
            flag = false;
          }

          if (flag && i === words.length - 1) {
            if (!newData) newData = [obj];
            else newData.push(obj);
          }
        });
      });

      setDataSearch(newData);
    });

    if (newData.length === 0) {
      setMensaje("Sin resultado");
      setToast(true);
    }

    setShowLoading(false);
  };

  const fetchPushNotification = (token: any) => {
    return putUsu({ changePush: true, deviceToken: token });
  };

  const fetchData = async () => {
    try {
      setShowLoading(true);
      const result = await getType("2");
      //const r = await needSupport();
      const resultNotificaciones = await getAllNotificaction("1");
      //console.info("---------", dataNotification)
      setDataNotification(resultNotificaciones.data);
      //console.info('resultNotificaciones', resultNotificaciones)
      PushNotifications.register();
      PushNotifications.addListener(
        "registration",
        async (token: PushNotificationToken) => {
          await fetchPushNotification(token.value);
          //setData({...data, deviceToken: token.value})
          //setShowLoading(false)
        }
      );
      //50506c93-41a7-4045-95f0-b177d8086a98 // ii
      //6342918c-49cf-47b6-9d12-fb7585efa447
      //setCurso(r.data.length);
      //setCurso(0);
      if (!data.length) setData(result.data);

      setShowLoading(false);
    } catch (error) {
      //console.log("errrorr", error);
      removeSesionData().then(() => {
        //console.info("adios !  ! ! x2");
        setModalInformacion(false);
        setMensaje("Hemos cerrado tu sesion");
        setToast(true);
        setShowLoading(false);
        props.history.push("/login");
      });
    }
  };

  const preSetSearch = (auxSearch?: string) => {
    let v = auxSearch ? auxSearch.trim() : search.trim();
    //let v = search.trim();
    if (v === "") {
      setDataSearch([]);
      return;
    }
    if (v.length > 2) fetchDataSearch(v);
    else {
      setMensaje("Introduzca minimo 3 caracteres");
      setToast(true);
    }
  };

  const newRender = () => {
    setRender1(!render1);
  };

  const getDataPromoBanner = async () => {
    //console.info("getDataPromoBanner", dataPromotionBanner)
    const { data, recomendados } = await getPromotionBanner();
    setDataPromotionBanner(data);
    setDataRecomendados(recomendados);
  };

  useEffect(() => {
    getLocalUser().then((usu: any) => {
      //console.info("resssss", usu.id);
      if (usu.id) {
        fetchData();
      } else {
        //console.info("adios !  ! !");
        setMensaje("Hemos cerrado tu sesion");
        setToast(true);
        setShowLoading(false);
        props.history.push("/login");
      }
    });
    getDataPromoBanner();
  }, [useFetch]);

  const goToFromNotification = (obj: any) => {
    setModalInformacion(false);
    //console.info("obj", obj);
    if (obj.txtPromotion) {
      props.history.push("/promotion", { initialSearch: obj.txtPromotion });
    } else {
      fetchDataSearch(obj.txtProduct);
    }
  };

  const handleClickPromotionBanner = (banner: any) => {
    console.info("banner000", banner)
    if (banner.idCategory) {
      fetchDataSearch(banner.name);
    } else {
      props.history.push("/promotion", { initialSearch: banner.name });
    }
  };

  const handleClickRecomendado = (banner: any) => {
    setDataSearch([]);
    setSearch(banner.name);
    preSetSearch(banner.name);
  };

  const valuesOfData = useCallback(() => {
    const f = async () => {
      //console.info("loadingcar a TRUE", );
      //console.info("dataProductModifiy", dataProductModifiy)
      setLoadingCar(true);
      if (dataSearch && dataProductModifiy) {
        let dataToSave: any[] = [];
        //console.info("dataSearch//////////////////////", dataSearch);
        Object.keys(dataSearch)?.map(async function (key, index) {
          //console.info("key//////////////////////", key);
          const obj = dataSearch[key];
          //dataSearch[key].map((obj: any) => {
          obj.presentations.forEach(
            async (presentation: any, index: number) => {
              if (presentation.quantity > -1) {
                dataToSave.push(obj);
              }
            }
          );
          //});
        });

        const nada = () => {};
        await Promise.all(
          dataToSave.map(async (element) => {
            await AddProductOrderNEW(element, 0, false, nada);
            //console.info("element", element);
          })
        );
        setdataProductModifiy(false);
      }
      //console.info("loadingcar a FALSE");
      setLoadingCar(false);
    };
    f();
    /*
    show loading 
    fetch a guardar todos los productos
    */
  }, [dataSearch, dataSearch, dataProductModifiy]);

  ///will mount y el return es el unmount
  useEffect(() => {
    return () => valuesOfData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valuesOfData]);

  const handleDeepLink = ({ category, product }: any) => {
    console.info("handleDeepLink", category, product);

    if (category) {
      //props.history.push("/category", { category: category, product: product });
      props.history.push("/category", { category, product });
    }
  };

  useEffect(() => {
    if (data.length <= 0 || !lll.search) {
      return;
    }
    console.log(`PIRELA catalogue tengo data ${data}  JSON.stringify(props)`);
    console.info("PIRELA prop " + JSON.stringify(props));
    const searchParam = lll.search.substring(1);
    const split = searchParam?.split("=");
    console.log(`PIRELA split  ${JSON.stringify(split)}`);
    const idCategoria = split?.[1]?.split("&")?.[0];
    const idProducto = split?.[2];
    console.log(
      `PIRELA split catego ${JSON.stringify(idCategoria)} ${JSON.stringify(
        idProducto
      )}`
    );

    const categoria = data.find((cat: any) => cat.id === idCategoria);
    console.log(`PIRELA categoria ${categoria}`);
    if (categoria) {
      handleDeepLink({
        category: categoria,
        product: idProducto,
      });
    }
  }, [data, lll]);

  useEffect(() => {
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (!search.trim()) {
      setResults([]);
      setDataSearchTxt([]);
      setDataSearch([]);
      setAllData_([]);
      return;
    }

    timerRef.current = setTimeout(async () => {
      setIsResultLoading(true);
      
      if (search.length < 3){
        setDataSearchTxt([]);
        setDataSearch([]);
        setAllData_([]);
        setIsResultLoading(false);
        return;
      }

      
      //const {data} = await getProductSearchTxt(search);
      const { data } = await getProductsSearch(search);
      setAllData_(data);
      let newData: any[] = [];
      Object.keys(data).map(function (key, index) {
        data[key].map((obj: any) => {
          const filter =
            obj.name.toUpperCase() + " " + obj.content.toUpperCase();
          const words = search.toUpperCase().split(" ");
          let flag = true;
          words.forEach((word: any, i: number) => {
            if (!flag) return;

            if (!filter.includes(word)) {
              flag = false;
            }

            if (flag && i === words.length - 1) {
              if (!newData) newData = [obj];
              else newData.push(obj);
            }
          });
        });

        setDataSearchTxt(newData);
      });

      if(search === props.location?.state?.initialSearch){
        //setResults([]);
        setDataSearchTxt([]);
        //setDataSearch([]);
        //setAllData_([]);
      }

      setIsResultLoading(false);

      //console.info("consultar....", data)
    }, 500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [search]);

  useEffect(() => {
    if (props.location.state && props.location.state.initialSearch) {
      setSearch(props.location.state.initialSearch)
      preSetSearch(props.location.state.initialSearch)
    }
  }, [props.location.state]);
      
  return (
    <IonPage>
      <Input
        txt="Buscar"
        onInput={(value: string) => setSearch(value)}
        value={search}
        positionTxt={"floating"}
        type={"text"}
        className={"catalogueInput catalogueHeader022"}
        icon={CERRARBUSCAR2}
        onClickIcon={() => {
          setDataSearch([]);
          setDataSearchTxt([]);
          setSearch("");
        }}
        //icon2={BUSCARCATALOGO}
        icon2={LUPA}
        onClickIcon2={() => {
          preSetSearch();
        }}
        icon3={TAB4}
        onClickIcon3={() => {
          props.history.push("/preOrder");
        }}
        onKeyDown={(w: any) => {
          if (w.key === "Enter") preSetSearch();
        }}
      />
      {
        <SearchList
          data={dataSearchTxt}
          isLoading={isResultsLoading}
          onClick={(producto: any) => {
            console.info("producto", producto);
            setDataSearch(dataSearchTxt);
            setProductPreSelected(producto);
          }}
        />
      }
      <IonContent className="ion-padding" overflow-scroll="true">
        {
          //loadingCar && <IonContent className="ion-padding"> <img style={{marginTop: "40vh", marginLeft: "43vw"}} src="https://www.sanapp.info/Imagenes/prueba.gif" className="loading" alt="San andres"/> </IonContent>
        }
        {
          <div>
            <div className="fontmilkshake cataloguePromoTxt24">Promos</div>
            <CustomCarousel
              data={dataPromotionBanner}
              handleclik={handleClickPromotionBanner}
            />
            <IonModal
              cssClass={"modalInformativo"}
              isOpen={modalInformacion}
              onDidDismiss={() => setModalInformacion(false)}
            >
              <IonHeader>
                <IonToolbar>
                  <IonButtons slot="end">
                    <img
                      onClick={() => setModalInformacion(false)}
                      src={CERRARBUSCAR2}
                      alt="San andres"
                      width="16px"
                      height="16px"
                      style={{ marginTop: "-40px" }}
                    />
                  </IonButtons>
                  <IonTitle className="ion-text-center titlePadding20">
                    <img
                      src={CARPA}
                      alt="San andres"
                      width="100%"
                      height="100%"
                    />
                  </IonTitle>
                </IonToolbar>
              </IonHeader>
              <div className={"contModalInf"}>
                {dataNotification.map((notificacion: any, iNot: number) => (
                  <div key={iNot}>
                    <div onClick={() => goToFromNotification(notificacion)}>
                      <img src={notificacion.img} alt="notificacion" />
                    </div>
                    <br />
                    <div className={"notificacionTxt"}>{notificacion.txt}</div>
                    <br />
                  </div>
                ))}
              </div>
            </IonModal>

            <IonLoading
              isOpen={showLoading || loadingCar}
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

            <div className="registerContent">
              <div className="registerContent2">
                <div className="">
                  <div className="">
                    {/*
                    curso > 0 && (
                      <div>
                        <div className="catalogueNumber ion-text-center">
                          {curso}
                        </div>
                        <div
                          className="catalogueCurso"
                          onClick={() =>
                            props.history.push("/voucher", {
                              back: "catalogue",
                              showSave: true,
                              fetch: Math.floor(Math.random() * 10000 + 1),
                            })
                          }
                        >
                          Pedido en curso
                          <IonImg
                            src={ICONPEDIDOCURSO}
                            className={"iconCurso"}
                            onClick={() => {}}
                          />
                        </div>
                      </div>
                    )
                    */}

                    <div className="ion-text-center fontmilkshake catalogue0Txt24">
                      Cátalogo
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {!(dataSearch || []).length && (
              <div className="contentAsd">
                <div className="asdasd">
                  <br />
                  <div
                    style={{
                      color: "transparent",
                      fontSize: "1em",
                      width: "100vw",
                      textAlign: "center",
                    }}
                  >
                    {"mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm"}
                  </div>
                  <CardCatalogue
                    data={data}
                    onClick={(obj: string) => {
                      console.info("category obj", obj);
                      props.history.push("/category", { category: obj });
                    }}
                    loading={showLoading}
                  />
                </div>
              </div>
            )}
            
            {(dataSearch || []).length > 0 && (
              <div className="">
                <br />
                <CardFastOrder
                  data={dataSearch || []}
                  render={render1}
                  setRender={() => newRender()}
                  goDetailProduct={(product: any) => {
                    props.history.push("/product", { product });
                  }}
                  allData={allData_}
                  fast={true}
                  showDetailProd={true}
                  setLoadingCar={setLoadingCar}
                  setdataProductModifiy={setdataProductModifiy}
                  productPreSelected={productPreSelected}
                  setProductPreSelected={setProductPreSelected}
                />
                <br />
                <br />
                <br />
              </div>
            )}

            <div className="fontmilkshake cataloguePromoTxt24">
              Recomendados
            </div>
            <CustomCarouselCaro
              data={dataRecomendados}
              handleclik={handleClickRecomendado}
            />
            <div style={{ marginBottom: "80px" }}></div>
          </div>
        }
      </IonContent>

      <Tabs selected={"1"} />
    </IonPage>
  );
};

export default Catalogue;
