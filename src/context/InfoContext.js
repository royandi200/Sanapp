import React, { useState } from "react";

const Context = React.createContext({});

export function TabContextProvider({ children }) {
  const [ws, setWs] = useState("");
  const [cate, setCate] = useState({});
  const [deepLink, setDeepLink] = useState(true);
  const [first, setFirst] = useState(true);
  const [petition, setPetition] = useState(false);
  const [loadingCar, setLoadingCar] = useState(false);
  const [products, setProducts] = useState([]);

  return (
    <Context.Provider
      value={{
        cate,
        setCate,
        ws,
        setWs,
        first,
        setFirst,
        petition,
        setPetition,
        products,
        setProducts,
        loadingCar,
        setLoadingCar,
        deepLink,
        setDeepLink
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
