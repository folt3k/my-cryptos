// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import axios from "axios";

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
  res: NextApiResponse<any>
) {
  switch (req.method) {
    case "GET":
      await getAll(req, res);
      break;
    case "POST":
      await create(req, res);
      break;
    case "PUT":
      await update(req, res);
      break;
    case "DELETE":
      await remove(req, res);
      break;
  }
}

const getAll = async (req: NextApiRequest, res: NextApiResponse<any>) => {
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

  const resItems = items.map((item) => {
    const coin = coins.find((c) => c.id === item.id);
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
  });

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

const create = async (req: NextApiRequest, res: NextApiResponse<any>) => {
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
    res.status(400).send(e);
  }
};

const update = async (req: NextApiRequest, res: NextApiResponse<any>) => {
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
    res.status(400).send(e);
  }
};

const remove = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const database = getDatabase();

  const newDatabase = {
    ...database,
    items: database.items.filter((item) => item.id !== req.body.id),
  };

  try {
    fs.writeFileSync(path.resolve(DB_PATH), JSON.stringify(newDatabase));

    res.status(200).json({});
  } catch (e) {
    res.status(400).send(e);
  }
};
