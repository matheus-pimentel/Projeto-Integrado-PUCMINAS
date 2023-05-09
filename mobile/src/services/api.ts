import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.100.44:3005"
  // baseURL: "https://financaspessoais.onrender.com"
});