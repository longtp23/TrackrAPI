import axios from "axios";

const BASE_URL = "https://trackr-api.onrender.com/api";
// const BASE_URL = "http://localhost:9000/api";
// const BASE_URL = "http://192.168.2.90:9000/api";

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});
