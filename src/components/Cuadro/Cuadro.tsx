import React from "react";

import "./Cuadro.css";

import { IonGrid, IonRow, IonCol, IonImg } from "@ionic/react";

interface PropCuadro {
  cuadros: any[];
  size: string;
  sizeFirsEndtCol?: string;
  handleClick: Function;
  actSelect: any;
}

export function Cuadro(props: PropCuadro) {
  return (
    <div>
      <IonGrid>
        <IonRow>
          <IonGrid>
            <IonRow className="ion-text-center ion-align-items-center">
              {props.sizeFirsEndtCol && (
                <IonCol
                  className="ion-text-center"
                  size={props.sizeFirsEndtCol}
                ></IonCol>
              )}
              {props.cuadros.map((cuadro: any) => {
                return (
                  <IonCol className="ion-text-center" size={props.size}>
                    <div
                      className={`${
                        (props.actSelect || {}).id === cuadro.id
                          ? "cuadro1"
                          : "cuadro"
                      }`}
                      onClick={() => props.handleClick(cuadro)}
                    >
                      <IonImg
                        src={cuadro.icon || cuadro.img}
                        className={"img1"}
                      />
                      {cuadro.titulo}
                    </div>
                  </IonCol>
                );
              })}
              {props.sizeFirsEndtCol && (
                <IonCol
                  className="ion-text-center"
                  size={props.sizeFirsEndtCol}
                ></IonCol>
              )}
            </IonRow>
          </IonGrid>
        </IonRow>
      </IonGrid>
    </div>
  );
}
