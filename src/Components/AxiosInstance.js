import axios from "axios";

const instance = axios.create({
  baseURL: "http://103.18.20.109:8090/", //fe
  //  baseURL: "http://localhost:23254/"      //local fs
});

instance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("user"))?.Token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.CompanyId = window.localStorage.getItem("CompanyId");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
