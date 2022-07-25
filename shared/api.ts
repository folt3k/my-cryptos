import axios from "axios";
import { Option } from "./models/common";

const api = axios.create({
  baseURL: `http://localhost:3000/api`,
});

export const getData = () => api.get("/data").then((res) => res.data);

export const addAsset = (body: { id: string; amount: number }) =>
  api.post("/data", body);

export const updateAsset = (body: { id: string; amount: number }) =>
  api.put("/data", body);

export const removeAsset = (id: string) =>
  api.delete("/data", { data: { id } });

export const getAssetsOptions = (query: string): Promise<{ items: Option[] }> =>
  api.get("/coins", { params: { q: query } }).then((res) => res.data);
