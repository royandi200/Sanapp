import { IonContent, IonPage, IonLoading } from "@ionic/react";

import React, { useState, useEffect, useContext } from "react";

import "./Promotion.css";

import { Input } from "../../components/Inputs/Input";

import { Tabs } from "../../components/Tabs/Tabs";

import { LUPA, CERRARBUSCAR2, TAB4, LOADINGCARRITO } from "../../const/imgs";
import { getPromotion } from "../../api/promotion/promotion";
import { CardPromotion } from "../../components/Cards/Card";
import InfoContext from "../../context/InfoContext";
//import { needSupport } from "../../api/pedido/pedido";

const Promotion: React.FC<any> = (props) => {
  const { loadingCar }  = useContext<any>(InfoContext)

  const [showLoading, setShowLoading] = useState(true);
  const [data, setData] = useState<any>([]);
  const [render, setRender] = useState<any>(null);
  //const [curso, setCurso] = useState(0);

  const [useFetch, setUseFetch] = useState("");
  const propFetch = props.location
    ? props.location.state
      ? props.location.state.fetch2
      : null
    : useFetch;

  const [dataSearch, setDataSearch] = useState<any>([]);
  const [search, setSearch] = useState<any>("");

  const preSetSearch = (v: string, dataSend?: any[]) => {
    if (v === "") {
      setSearch(v);
      return;
    }
    let newData: any[];
    (dataSend ? dataSend : data).map((obj: any) => {
      const filter = obj.name.toUpperCase();
      const words = (v || "").toUpperCase().split(" ");
      let flag = true;
      words.forEach((word: any, i: number) => {
        if (!flag) {
          return;
        }
        if (!filter.includes(word)) {
          flag = false;
        }
        if (flag && i === words.length - 1) {
          if (!newData) {
            newData = [obj];
          } else {
            newData.push(obj);
          }
        }
      });
      setDataSearch(newData);
    });
    setSearch(v);
  };

  const fetchData = async () => {
    setShowLoading(true);
    //const { data } = await needSupport();
    const result = await getPromotion();
    //setCurso(data.length);
    setData(result.data);
    preSetSearch(props.location.state.initialSearch, result.data);
    setShowLoading(false);
  };

  if (propFetch !== useFetch && propFetch) {
    setUseFetch(propFetch);
  }

  useEffect(() => {
    fetchData();
  }, [useFetch, props.location.state.initialSearch]);
  console.log(`PIRELA promocion ${JSON.stringify(props)}`)
  return (
    <IonPage>
      {
        //loadingCar && <IonContent className="ion-padding"> <img style={{marginTop: "40vh", marginLeft: "43vw"}} src="https://www.sanapp.info/Imagenes/prueba.gif" className="loading" alt="San andres"/> </IonContent>
      }
      {//!loadingCar &&
        <div>
          <Input
              txt="Buscar"
              onInput={(value: string) => preSetSearch(value)}
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
          <IonContent className="ion-padding" style={{height: "85vh"}}>
            
            <IonLoading
              isOpen={showLoading || loadingCar}
              onDidDismiss={() => setShowLoading(false)}
              spinner={null}
              message={`<img src="https://www.sanapp.info/Imagenes/prueba.gif" class="loading" alt="San andres"/>`}
            />
            <div className="registerContent">
              <div className="registerContent2">
                <div className="">
                  <div className="">
                    {/*curso > 0 && (
                      <div>
                        <div className="catalogueNumber ion-text-center">
                          {curso}
                        </div>
                        <div
                          className="catalogueCurso"
                          onClick={() =>
                            props.history.push("/voucher", {
                              back: "promotion",
                              showSave: true,
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
                        )*/}
                    <div className="ion-text-center fontmilkshake catalogueTxt24">
                      Promociones
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CardPromotion
              data={search === "" ? data : dataSearch}
              setRender={setRender}
              render={render}
            />
            <div className="categoryBottom"></div>
            <Tabs selected={"2"} />
          </IonContent>
        </div>
      }
    </IonPage>
  );
};

export default Promotion;
