import axios from "axios";
import { Option } from "./models/common";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getData = () => api.get("/data").then((res) => res.data);

export const updateDeposit = (value: number) =>
  api.put("/wallet/deposit", { value });

export const addAsset = (body: { id: string; amount: number }) =>
  api.post("/assets", body);

export const updateAsset = (body: { id: string; amount: number }) =>
  api.put("/assets", body);

export const removeAsset = (id: string) =>
  api.delete("/assets", { data: { id } });

export const getAssetsOptions = (query: string): Promise<{ items: Option[] }> =>
  api.get("/dicts/coins", { params: { q: query } }).then((res) => res.data);
