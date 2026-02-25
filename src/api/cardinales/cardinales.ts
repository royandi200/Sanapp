import { getAxio } from "../api";

const path = "cardinales/";

export function getCardinales(status: number) {
  return getAxio()
    .get(path + "all/" + status)
    .then((res: any) => {
      return res.data;
    });
}

export function getDiasCardinalidad(idCardenalidad: string, cantidad: string) {
  return getAxio()
  
    .get(`${path}days/${idCardenalidad}/${cantidad}` )
    .then((res: any) => {
      return res.data;
    });
}
