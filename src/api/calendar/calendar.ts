import { getAxio } from "../api";

const path = "calendar/";

export function getCalendar(allDay: boolean) {
  return getAxio()
    .get(path + "all-day/" + allDay)
    .then((res: any) => {
      return res.data;
    });
}

export function getProducts(type: string) {
  return getAxio()
    .get(path + "categories/" + type)
    .then((res: any) => {
      return res.data;
    });
}
