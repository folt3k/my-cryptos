import { Currencies } from "./common";

export interface MyCryptosData {
  paid: number;
  total: Currencies;
  balance: Partial<Currencies>;
  items: MyCryptoItem[];
}

export interface MyCryptoItem {
  id: string;
  amount: number;
  symbol: string;
  image: string;
  price: Currencies;
  total: Currencies;
}
