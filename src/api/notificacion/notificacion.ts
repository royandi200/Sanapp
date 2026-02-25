import { getAxio } from "../api";

const path = "notificacion/";

export function getAllNotificaction(status: string) {
  return getAxio()
    .get(path + "all/" + status)
    .then((res: any) => {
      return res.data;
    })
    .catch((error: any) => {
      console.info("error", error);
    });
}
