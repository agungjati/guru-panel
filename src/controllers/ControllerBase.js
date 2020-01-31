const { apiEndPoint } = require("./config");
const axios = require("axios");

export default class ControllerBase {
  apiEndPoint = apiEndPoint;
  axios;

  constructor() {
    const token = localStorage.getItem("jwt");
    this.axios = axios.create({
      baseURL: this.apiEndPoint,
      headers: {
        authorization: "Bearer " + token
      }
    });

    this.axios.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        if (error?.response?.status === 401) {
          localStorage.removeItem("jwt");
        }
        return Promise.reject(error);
      }
    );
  }
}
