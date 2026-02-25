import { IonContent, IonPage, IonLoading, IonImg } from "@ionic/react";

import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";

import "./Category.css";

import { LUPA, BACK, CERRARBUSCAR2, TAB4 } from "../../const/imgs";

import { Input } from "../../components/Inputs/Input";
import { CardCategories, CardFastOrder } from "../../components/Cards/Card";
import { Tabs } from "../../components/Tabs/Tabs";

import { getProducts } from "../../api/type/type";
import { Link } from "react-router-dom";

import { CustomCarousel } from "../../components/Carousel/Carousel";
import { getPromotionBanner } from "../../api/promotion/promotion";

import InfoContext from "../../context/InfoContext";
import { AddProductOrderNEW } from "../../const/functions";

const Catalogue: React.FC<any> = (props) => {
  const [showLoading, setShowLoading] = useState(true);
  //const [showLoadingCarProduct, setShowLoadingCarProduct] = useState(false);
  const [data, setData] = useState<any>(null);
  const [dataProductModifiy, setdataProductModifiy] = useState<any>(false);
  const [render1, setRender1] = useState(true);
  const [idCategory, setIdCategory] = useState("");
  //const [dataFilter, setDataFilter] = useState<any>(null);

  const [dataPromotionBanner, setDataPromotionBanner] = useState([]);

  const [dataSearch, setDataSearch] = useState<any>([]);
  const [search, setSearch] = useState<any>("");

  const { products, loadingCar, setLoadingCar } = useContext<any>(InfoContext);

  const [productoDeepLink, setProductoDeepLink] = useState(null);

  const preSetSearch = (v: string) => {
    if (v === "") {
      setSearch(v);
      return;
    }

    let newData: any[];

    Object.keys(data).map(function (key, index) {
      data[key].map((obj: any) => {
        const filter = obj.name.toUpperCase() + " " + obj.content.toUpperCase();
        const words = v.toUpperCase().split(" ");
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
    setSearch(v);
  };

  let propCat = "06dd63f5-f22b-4cc4-8aac-2d011a25f0d2";
  let category = { name: "" };
  if (props.location.state) {
    if (props.location.state.category) {
      propCat = props.location.state.category.id;
      category = props.location.state.category;
    } else {
      propCat = "06dd63f5-f22b-4cc4-8aac-2d011a25f0d2";
    }
  } else {
    propCat = "06dd63f5-f22b-4cc4-8aac-2d011a25f0d2";
  }

  if (propCat !== idCategory) {
    setIdCategory(propCat);
    setData(null);
    setShowLoading(true);
  }

  const newRender = () => {
    setRender1(!render1);
  };

  const fetchData = async () => {
    if (idCategory) {
      const result = await getProducts("" + idCategory);
      setData(result.data);
    }
    setShowLoading(false);
  };

  if (!data && !showLoading) {
    fetchData();
  }

  const handleClickPromotionBanner = (banner: any) => {
    if (banner.idCategory) {
      props.history.push("/catalogue", { initialSearch: banner.name });
    } else {
      props.history.push("/promotion", { initialSearch: banner.name });
    }
    
  };

  const getDataPromoBanner = async () => {
    const { data } = await getPromotionBanner();
    setDataPromotionBanner(data);
  };

  useEffect(() => {
    setShowLoading(true);
    getDataPromoBanner();
    fetchData();
  }, [idCategory]);

  useEffect( () => {
    
    if(!data || !props?.location?.state?.product) {return}
    const idProducto = props?.location?.state?.product
    let producto: any = null
    
    Object.keys(data).forEach( (subCat: any) => {
      if(producto) {return}
        producto = data[subCat].find((prod: any) => prod.id === idProducto )
    });
    console.info("PIRELA producto", producto)
    if(producto){
      setProductoDeepLink(producto)
    }
    
  }, [data])

  const valuesOfData = useCallback(() => {
    const f = async () => {
      //console.info("loadingcar a TRUE", );
      //console.info("dataProductModifiy", dataProductModifiy)
      setLoadingCar(true);
      if (data && dataProductModifiy) {
        let dataToSave: any[] = [];
        
        Object.keys(data)?.map(async function (key, index) {
          data[key].map((obj: any) => {
            obj.presentations.forEach(
              async (presentation: any, index: number) => {
                if (presentation.quantity > -1) {
                  dataToSave.push(obj);
                }
              }
            );
          });
        });
        
        const nada = () => {};
        await Promise.all(
          dataToSave.map(async (element) => {
            await AddProductOrderNEW(element, 0, false, nada);
            //console.info("element", element);
          })
        )
        setdataProductModifiy(false)
      }
      console.info("loadingcar a FALSE");
      setLoadingCar(false);
    }
    f()
    /*
    show loading 
    fetch a guardar todos los productos
    */
  }, [data, dataSearch, dataProductModifiy]);

  ///will mount y el return es el unmount
  useEffect(() => {
    return () => valuesOfData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valuesOfData]);

  return (
    <IonPage>
          <Input
            txt="Buscar"
            onInput={(w: string) => preSetSearch(w)}
            value={search}
            positionTxt={"floating"}
            type={"text"}
            className={"catalogueInput catalogueHeader022"}
            icon={CERRARBUSCAR2}
            icon2={LUPA}
            onClickIcon={() => {
              preSetSearch("");
            }}
            onClickIcon2={() => {}}
            icon3={TAB4}
            onClickIcon3={() => {
              props.history.push("/preOrder");
            }}
          />
          <div className="fontmilkshake cataloguePromoTxt24">Promos</div>
          <div className="ion-padding">
            <CustomCarousel
              data={dataPromotionBanner}
              handleclik={handleClickPromotionBanner}
            />
          </div>
          <IonContent className="ion-padding">
            <IonLoading
              isOpen={showLoading}
              onDidDismiss={() => setShowLoading(false)}
              spinner={null}
              message={`<img src="https://www.sanapp.info/Imagenes/prueba.gif" class="loading" alt="San andres"/>`}
            />

            <Link
              style={{ textDecoration: "none" }}
              className="categoryBack"
              to={"/catalogue"}
              onClick={() => {
                preSetSearch("");
              }}
            >
              <IonImg src={BACK} />
            </Link>

            <div className="registerContent">
              <div className="registerContent2">
                <div className="">
                  <div className="">
                    <div className="ion-text-center fontmilkshake catalogueTxt24">
                      {category.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {search === "" && (
              <div className="catalogueCard">
                <CardCategories
                  data={data || []}
                  setData={setData}
                  dataProductModifiy={dataProductModifiy}
                  setdataProductModifiy={setdataProductModifiy}
                  onClick={(product: any) => {
                    props.history.push("/product", { product });
                  }}
                  loading={showLoading}
                  newRender={newRender}
                  productoDeepLink={productoDeepLink}
                />
                <br />
                <br />
              </div>
            )}

            {search !== "" && (
              <CardFastOrder
                data={dataSearch || []}
                render={render1}
                setRender={() => newRender()}
                goDetailProduct={(product: any) => {
                  props.history.push("/product", { product });
                }}
                allData={data}
                fast={true}
                showDetailProd={true}
                setLoadingCar={setLoadingCar}
                setdataProductModifiy={setdataProductModifiy}
              />
            )}

            <div className="categoryBottom"></div>

            <Tabs selected={"1"} />
          </IonContent>
    </IonPage>
  );
};

export default Catalogue;
