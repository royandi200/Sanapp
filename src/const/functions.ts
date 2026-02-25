import { preOrder } from "../api/pedido/pedido";
import dayjs from "dayjs";

let timeOut: any = {};

export function getDays(dias: number, add: number = 0) {
  let newDays = [],
    j = add;
  for (let i = 0; i <= dias; i++) {
    const tempDay = dayjs().add(i + j + 1, "d");
    if (tempDay.day() === 0) {
    } else {
      newDays.push({
        txt: tempDay.format("DD MMM"),
        value: tempDay,
      });
    }
  }
  return newDays;
}

export function AddProductOrder(
  product: any,
  type: number = 0,
  isPromo = false,
  setPetition: Function
) {
  setPetition(true)
  clearTimeout(timeOut[product.id]);
  timeOut[product.id] = setTimeout(async function () {
    await preOrder(product, type, isPromo);
    //await actOrderItems(orderItems, product)
    setPetition(false)
  }, 250);
}

export async function AddProductOrderNEW(
  product: any,
  type: number = 0,
  isPromo = false,
  setPetition: Function
) {
  await preOrder(product, type, isPromo);
}

export function completeCodigo(txt: string, length: number = 5) {
  let newTxt;
  const long = txt.length;
  let x = "";
  if (long < 5)
    for (let index = 0; index < 5 - long; index++) {
      x += "0";
    }
  newTxt = x + txt;
  return newTxt;
}

export function getStatus(id: string) {
  switch (id) {
    case "d0481cf4-23fa-4afd-b894-92ea4ac4d390":
      return "Creado";
    case "d0481cf4-23fa-4afd-b894-92ea4ac4d299":
      return "Pendiente";
    case "d0481cf4-23fa-4afd-b894-92ea4ac4d391":
      return "Validando";
    case "d0481cf4-23fa-4afd-b894-92ea4ac4d298":
      return "Confirmado";
    case "d0481cf4-23fa-4afd-b894-92ea4ac4d297":
      return "Alistado";
    case "d0481cf4-23fa-4afd-b894-92ea4ac4d296":
      return "Entregado";
    case "d0481cf4-23fa-4afd-b894-92ea4ac4d295":
      return "Cancelado";
    case "d0491cf4-21fa-4afd-b891-92ea4ac4d297":
      return "Contra Entrega";
    case "d0501cf4-21fa-4afd-b891-92ea4ac4d297":
      return "Consignación";
    case "ce007abc-18ff-4200-9acf-3e4c5751f807":
      return "Soporte de pago";
    case "606ff53c-b738-4919-8eee-930eac137e9a":
      return "Compra de una promo";
    case "bbbaa4d3-ee7d-44a7-9dfa-91e2f2b2c43b":
      return "Crear una tienda";
    case "ddc44d14-cc0d-42e6-b3f0-76142ae1907d":
      return "Compra de un producto";
    case "fb6d5217-8236-4b3c-8c39-b3f03084d8be":
      return "Validar documentos";
    case "d0481cf4-23fa-4afd-b894-92ea4ac4d392":
      return "Resuelto";
  }
}

export function spliceTxt(txt: string, length: number) {
  const temp = txt.slice(0, length);
  const puntos = txt.split(temp);

  return temp + (puntos[1] !== "" ? "..." : "");
}

export function capitalize(txt: string) {
  if (typeof txt !== "string") return "";
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}

export const IVA = 0.025;

export const TYPE = {
  CREADO: "d0481cf4-23fa-4afd-b894-92ea4ac4d390",
  PENDIENTE: "d0481cf4-23fa-4afd-b894-92ea4ac4d299",
  VALIDANDO: "d0481cf4-23fa-4afd-b894-92ea4ac4d391",
  CONFIRMADO: "d0481cf4-23fa-4afd-b894-92ea4ac4d298",
  ALISTADO: "d0481cf4-23fa-4afd-b894-92ea4ac4d297",
  ENTREGADO: "d0481cf4-23fa-4afd-b894-92ea4ac4d296",
  CANCELADO: "d0481cf4-23fa-4afd-b894-92ea4ac4d295",
  CONTRAENTREGA: "d0491cf4-21fa-4afd-b891-92ea4ac4d297",
  CONSIGNACION: "d0501cf4-21fa-4afd-b891-92ea4ac4d297",
  ///////////////     TIPOS DE CAMBIO      ///////////////////
  CAMBIARMETODODEPAGO: "0f2d0c33-7b11-4721-aeb4-e25a533a732c",
  CAMBIARFECHAYHORA: "13cb53e9-ebee-46c0-8312-3a89307c4571",
  CAMBIARPRODUCTOS: "00961838-6016-4496-b161-1e4805c2c2aa",
  CAMBIARCANCELADO: "fb6d5217-8236-4b3c-8c39-b3f03084d123",
  CAMBIARSOPORTEDEPAGO: "ce007abc-18ff-4200-9acf-3e4c5751f807",
  COMPRAPROMO: "606ff53c-b738-4919-8eee-930eac137e9a",
  CREARTIENDA: "bbbaa4d3-ee7d-44a7-9dfa-91e2f2b2c43b",
  COMPRAPRODUCTO: "ddc44d14-cc0d-42e6-b3f0-76142ae1907d",
  VALIDARDOCUMENTO: "fb6d5217-8236-4b3c-8c39-b3f03084d8be",
  ///////////////     TIPOS DE DOCUMENTO      ////////////////
  DOCCE: "d0481cf4-23fa-4afd-b894-92ea4ac4d291",
  DOCCC: "d0481cf4-23fa-4afd-b894-92ea4ac4d292",
  ///////////////     TIPOS DE SOPORTE      ////////////////
  //EL MISMO PENDINTE
  RESUELTO: "d0481cf4-23fa-4afd-b894-92ea4ac4d392",
};
