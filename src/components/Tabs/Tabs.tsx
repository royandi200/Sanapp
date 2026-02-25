import React, { useEffect, useState } from "react";

import "./Tabs.css";
import { Link } from "react-router-dom";

import {
  TAB1,
  TAB2,
  //TAB3,
  //TAB4,
  TAB5,
  TAB11,
  TAB22,
  //TAB33,
  //TAB44,
  TAB55,
  SUPPORT,
  SUPPORT2,
} from "../../const/imgs";
import { getWs } from "../../api/public/public";

interface PropSegment {
  selected: string;
}

export function Tabs({ selected }: PropSegment) {
  const [ws, setWs] = useState("");

  const getDataWs = async () => {
    const { data } = await getWs();
    setWs(data.name);
  };

  useEffect(() => {
    getDataWs();
  }, []);
  return (
    <div>
      {selected !== "10" && selected !== "11" && (
        <div className="tabBackContent">
          {selected === "1" && (
            <div
              className="tabContent tabBackImg"
              style={{
                backgroundImage:
                  'url("' + (selected === "1" ? TAB11 : TAB1) + '")',
              }}
            ></div>
          )}
          {selected !== "1" && (
            <Link
              style={{ textDecoration: "none" }}
              to={{
                pathname: "/catalogue",
                state: { fetch1: Math.floor(Math.random() * 10000 + 1) },
              }}
            >
              <div
                className="tabContent tabBackImg"
                style={{
                  backgroundImage:
                    'url("' + (selected === "1" ? TAB11 : TAB1) + '")',
                }}
              ></div>
            </Link>
          )}

          {selected === "2" && (
            <div
              className="tabContent2 tabBackImg"
              style={{
                backgroundImage:
                  'url("' + (selected === "2" ? TAB22 : TAB2) + '")',
              }}
            ></div>
          )}
          {selected !== "2" && (
            <Link
              style={{ textDecoration: "none" }}
              to={{
                pathname: "/promotion",
                state: { fetch2: Math.floor(Math.random() * 10000 + 1) },
              }}
            >
              <div
                className="tabContent2 tabBackImg"
                style={{
                  backgroundImage:
                    'url("' + (selected === "2" ? TAB22 : TAB2) + '")',
                }}
              ></div>
            </Link>
          )}

          {selected === "10" && (
            <div>
              <a
                target="_blanck"
                rel="noreferrer"
                href={`https://api.whatsapp.com/send?phone=${ws}`}
              >
                <div
                  className="tabContent4 tabBackImg"
                  style={{ backgroundImage: 'url("' + SUPPORT + '")' }}
                ></div>
              </a>
            </div>
          )}

          {selected !== "10" && (
            <div>
              <a
                target="_blanck"
                rel="noreferrer"
                href={`https://api.whatsapp.com/send?phone=${ws}`}
              >
                <div
                  className="tabContent4 tabBackImg"
                  style={{ backgroundImage: 'url("' + SUPPORT + '")' }}
                ></div>
              </a>
            </div>
          )}
          
          

          {selected === "5" && (
            <div
              className="tabContent3 tabBackImg"
              style={{
                backgroundImage:
                  'url("' + (selected === "5" ? TAB55 : TAB5) + '")',
              }}
            ></div>
          )}
          {selected !== "5" && (
            <Link
              style={{ textDecoration: "none" }}
              to={{
                pathname: "/account",
                state: { fetch5: Math.floor(Math.random() * 10000 + 1) },
              }}
            >
              <div
                className="tabContent3 tabBackImg"
                style={{
                  backgroundImage:
                    'url("' + (selected === "5" ? TAB55 : TAB5) + '")',
                }}
              ></div>
            </Link>
          )}

        </div>
      )}
      {selected === "10" && (
        <div>
          <Link
            style={{ textDecoration: "none" }}
            to={{ pathname: "/support", state: { back: "/document" } }}
          >
            <div
              className="tabSuport tabBackImg"
              style={{ backgroundImage: 'url("' + SUPPORT + '")' }}
            ></div>
          </Link>
        </div>
      )}
      {selected === "11" && (
        <div
          className="tabSuport tabBackImg"
          style={{ backgroundImage: 'url("' + SUPPORT2 + '")' }}
        ></div>
      )}
    </div>
  );
}
