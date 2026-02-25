import axios from "axios";

import { Plugins } from "@capacitor/core";
//import { Storage } from '@capacitor/storage';

const { Storage } = Plugins;

//const URL = "https://api-san-andres.vercel.app/auth/";
//const URL = 'https://162.241.100.130:3004/auth/'
//const URL = `http://localhost:3005/auth/`;
const URL = `https://api.sanapp.info/auth/`

export function getWs() {
  return axios.get(URL + "whatsapp").then((res: any) => {
    return res.data;
  });
}

export function getPoliticas() {
  return axios.get(URL + "politicas").then((res: any) => {
    return res.data;
  });
}

export function sendNewPass(data: any) {
  return axios.post(URL + "phone-user", data).then((res: any) => {
    return res.data;
  });
}

export function logIn(data: any) {
  return axios.post(URL, data).then((res: any) => {
    if (res.data !== -2 && res.data !== -3) {
      saveSesionDate(res.data.data, res.data.token);
      axios.defaults.headers.common["Authorization"] = res.data.token;
    }
    return res.data;
  });
}

export function signUp(data: any) {
  return axios.post(URL + "signup/", data).then((res: any) => {
    return res.data;
  });
}

const saveSesionDate = (data = {}, token: string) => {
  const newData = JSON.stringify(data);
  sessionStorage.setItem("usu", newData);
  sessionStorage.setItem("token", token);
  saveLocal(newData, token);
};

const saveLocal = async (data: string, token: string) => {
  await Storage.set({
    key: "user",
    value: data,
  });
  await Storage.set({
    key: "token",
    value: token,
  });
};
