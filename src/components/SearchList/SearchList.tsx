import React from "react";

import { IonItem, IonLabel, IonAvatar, IonList } from "@ionic/react";

import "./SearchList.css";


export function SearchList({
  data,
  onClick,
  isLoading,
}: {
  data: {
    id: string;
    content: string;
    img: string;
    name: string;
    sku: string;
  }[];
  isLoading: boolean;
  onClick: (item: any) => void;
}) {
  console.info("data/////////////////////////////////", data);
  return (
    <div className={`search-list-container`}>
      {(isLoading || data.length > 0) && 
      <IonList className="search-results-list">
        {isLoading && (
          <span className="itemTxt">
            <img
              src={"https://www.sanapp.info/Imagenes/prueba.gif"}
              width={"50vw"}
              height={"50vw"}
              style={{ margin: "10px 40vw" }}
              alt="Loading..."
            />
          </span>
        )}
        {data.map((element: any, index: any) => (
          <div key={index}>
            {!isLoading && (
              <IonItem className="itemTxt" onClick={() => onClick(element)}>
                <IonAvatar slot="start">
                  <img src={element.img} alt={"img"} />
                </IonAvatar>
                <IonLabel>{element.content + " " + element.name}</IonLabel>
              </IonItem>
            )}
          </div>
        ))}
      </IonList>
      }
    </div>
  );
}
