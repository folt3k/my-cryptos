// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import axios from "axios";

import { MyCryptosData } from "../../../shared/models/data";

interface Item {
  id: string;
  amount: number;
}

interface Db {
  items: Item[];
  paid: number;
}

const DB_PATH = __dirname + "/../../../../database.json";

const getDatabase = (): Db => {
  try {
    return JSON.parse(fs.readFileSync(path.resolve(DB_PATH), "utf-8"));
  } catch (e) {
    return { items: [], paid: 0 };
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<object>
) {
  switch (req.method) {
    case "GET":
      await getData(req, res);
      break;
    case "POST":
      await create(req, res);
      break;
    case "PUT":
      req.url === "/api/data/deposit"
        ? await updateDeposit(req, res)
        : await update(req, res);
      break;
    case "DELETE":
      await remove(req, res);
      break;
  }
}

const getData = async (
  req: NextApiRequest,
  res: NextApiResponse<MyCryptosData>
) => {
  const database = getDatabase();
  const items = database.items;

  const [coins, prices] = await Promise.all([
    axios
      .get("https://api.coingecko.com/api/v3/coins/markets", {
        params: {
          vs_currency: "pln",
          ids: items.map((i) => i.id).join(","),
        },
      })
      .then((res) => res.data),

    axios
      .get("https://api.coingecko.com/api/v3/simple/price", {
        params: {
          vs_currencies: "pln,usd",
          ids: items.map((i) => i.id).join(","),
        },
      })
      .then((res) => res.data),
  ]);

  const resItems = items
    .map((item) => {
      const coin = coins.find((c: { id: string }) => c.id === item.id);
      const price = prices[item.id];

      return {
        ...item,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image,
        price,
        total: {
          usd: Math.round(item.amount * price.usd),
          pln: Math.round(item.amount * price.pln),
        },
      };
    })
    .sort((a, b) => (a.total.usd > b.total.usd ? -1 : 1));

  const total = {
    usd: resItems.reduce((prev, curr) => prev + curr.total.usd, 0),
    pln: resItems.reduce((prev, curr) => prev + curr.total.pln, 0),
  };

  const balance = {
    pln: database.paid - total.pln,
  };

  res
    .status(200)
    .json({ paid: database.paid, total, balance, items: resItems });
};

const create = async (
  req: NextApiRequest,
  res: NextApiResponse<object | { msg: string }>
) => {
  const database = getDatabase();

  if (!req.body.id || !req.body.amount) {
    return res.status(400).json({ msg: "Niepoprawne dane" });
  }

  const itemExists = database.items.find((item) => item.id === req.body.id);

  if (itemExists) {
    return res
      .status(400)
      .json({ msg: "Dane dla tej kryptowaluty już istnieją" });
  }

  const newDatabase = {
    ...database,
    items: [...database.items, { id: req.body.id, amount: req.body.amount }],
  };

  try {
    fs.writeFileSync(path.resolve(DB_PATH), JSON.stringify(newDatabase));

    res.status(200).json({});
  } catch (e) {
    res.status(400).send({ msg: e });
  }
};

const update = async (
  req: NextApiRequest,
  res: NextApiResponse<object | { msg: string }>
) => {
  const database = getDatabase();

  const newDatabase = {
    ...database,
    items: database.items.map((item) =>
      item.id === req.body.id
        ? { ...item, amount: req.body.amount || item.amount }
        : item
    ),
  };

  try {
    fs.writeFileSync(path.resolve(DB_PATH), JSON.stringify(newDatabase));

    res.status(200).json({});
  } catch (e) {
    res.status(400).send({ msg: e });
  }
};

const remove = async (
  req: NextApiRequest,
  res: NextApiResponse<object | { msg: string }>
) => {
  const database = getDatabase();

  const newDatabase = {
    ...database,
    items: database.items.filter((item) => item.id !== req.body.id),
  };

  try {
    fs.writeFileSync(path.resolve(DB_PATH), JSON.stringify(newDatabase));

    res.status(200).json({});
  } catch (e) {
    res.status(400).send({ msg: e });
  }
};

const updateDeposit = async (
  req: NextApiRequest,
  res: NextApiResponse<object | { msg: string }>
) => {
  const database = getDatabase();

  if (req.body.value === null || req.body.value === undefined) {
    res.status(400).send({ msg: "Brakuje wartości" });
  }

  const newDatabase: Db = {
    ...database,
    paid: req.body.value,
  };

  try {
    fs.writeFileSync(path.resolve(DB_PATH), JSON.stringify(newDatabase));

    res.status(200).json({});
  } catch (e) {
    res.status(400).send({ msg: e });
  }
};