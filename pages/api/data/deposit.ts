// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

interface Item {
  id: string;
  amount: number;
}

interface Db {
  items: Item[];
  paid: number;
}

const DB_PATH = __dirname + "/../../../../../database.json";

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
    case "PUT":
      await updateDeposit(req, res);
      break;
  }
}

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

  console.log(newDatabase);
  

  try {
    fs.writeFileSync(path.resolve(DB_PATH), JSON.stringify(newDatabase));

    res.status(200).json({});
  } catch (e) {
    res.status(400).send({ msg: e });
  }
};
