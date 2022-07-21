import axios from "axios";
import { Option } from "./models/common";

const api = axios.create({
  baseURL: `http://localhost:3000/api`,
});

export const getData = () => api.get("/data").then((res) => res.data);

export const getAssets = (query: string): Promise<{ items: Option[] }> =>
  api.get("/coins", { params: { q: query } }).then((res) => res.data);
