import React, { useEffect } from "react";
import { Plugins } from "@capacitor/core";

import { useHistory } from "react-router-dom";

const { App: CapApp } = Plugins;

const AppUrlListener: React.FC<any> = () => {
  const history = useHistory();
  
  // Función para procesar la URL
  const handleDeepLink = (url: string | null) => {
    try {
      //if(aaa === true){return}
      if (!url) {
        return;
      }
      //console.info("PIRELA deepLink PASE", deepLink)
      console.log(`PIRELA url, ${JSON.stringify(url)}`);
      const scheme = "sanapp://";
      const urlSinEsquema = url.replace(scheme, "");
      const [rutaYHost, parametros] = urlSinEsquema.split("?");
      console.log(`PIRELA PUSH ${JSON.stringify(parametros)}`);
      if (parametros) {
        console.log(`PIRELA PUSH`);
        setTimeout( () => {
          console.log(`PIRELA YA PASARON 3000 ${parametros}`);
          if(parametros.includes('category')){
            console.log(`PIRELA PUSH catalogo ${parametros}`);
            history.push({
              pathname: '/catalogue',
              search: `?${parametros}`
            });
          }
          if(parametros.includes('promo')){
            console.log(`PIRELA PUSH promo... ${parametros}`);
            const partes = parametros.split("=")[1]
            history.push("/promotion", { initialSearch: partes });
            
          }
          
        }, 4000)
        
      } else {
        console.log(`PIRELA PUSH NOOO---`);
      }
    } catch (error) {
      console.info(`PIRELA error --- ${JSON.stringify(error)}`)
    }
  };

  useEffect(() => {
    CapApp.addListener("appUrlOpen", (data: any) => {
      handleDeepLink(data.url);
    });

    CapApp.getLaunchUrl()
      .then(({ url, ...rest }) => {
        handleDeepLink(url);
      })
      .catch((err) => {
        console.error("Error en getLaunchUrl:", err);
      });
  }, []);

  return null;
};

export default AppUrlListener;
