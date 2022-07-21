import axios from "axios";

const api = axios.create({
  baseURL: `http://localhost:3000/api`,
});

export const getData = () => api.get("/data").then((res) => res.data);
