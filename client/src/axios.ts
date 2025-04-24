import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

$api.defaults.headers.common["Access-Control-Allow-Methods"] = 'POST, GET, OPTIONS, PUT, DELETE';
$api.defaults.headers.common["Access-Control-Allow-Headers"] = 'Content-Type, Origin, Authorization';

$api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if(token) 
      config.headers = {
        authorization: `bearer ${token}`,
      } as any;
    return config;
  }
)

export function setHeader(token: string) {
  $api.defaults.headers.common['authorization'] = `bearer ${token}`;
}

export function dropHeader() {
  delete $api.defaults.headers.common['authorization'];
}

export default $api;