import { getAxio } from '../api';

const path = "flete/";

export function getFlete({monto, idCardinal}:any) {
  return getAxio()
    .get(`${path}idCardinal/${idCardinal}/${monto}`)
    .then((res: any) => {
      return res.data;
    })
    .catch((error: any) => {
      console.info("error", error);
    });
}