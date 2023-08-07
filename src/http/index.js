import axios from "axios";
import Cookies from "js-cookie";

export const auth = axios.create({
  baseURL: import.meta.env.DEV ? import.meta.env.VITE_API_HOST_DEV + "api/auth" : import.meta.env.VITE_API_HOST_PROD + "api/auth",
});
//http://api.chat-roulet.ru/api/auth"
export const universal = axios.create({
  baseURL:'https://chat-roulet.ru/',
  headers: {
    Authorization: Cookies.get("accessToken"),
  },
});
