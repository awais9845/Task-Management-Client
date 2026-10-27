import axios from "axios";

const Axios = axios.create({
  baseURL: "http://localhost:2000/api",
  withCredentials: true,
});

export default Axios;
