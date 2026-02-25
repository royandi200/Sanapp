import axios from "axios";

export function getAxio() {
  return axios.create({
    //baseURL: `https://api-san-andres.vercel.app/api/v1/`,
    //baseURL: `https://162.241.100.130:3004/api/v1/`,
    //baseURL: `http://localhost:3005/api/v1/`,
    baseURL: `https://api.sanapp.info/api/v1/`,
    headers: {
      "Content-Type": "application/json",
      Authorization: sessionStorage.getItem("token"),
    },
  });
}
