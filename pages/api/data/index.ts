// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

import prisma from "../../../shared";
import { MyCryptosData } from "../../../shared/models/data";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<object>
) {
  switch (req.method) {
    case "GET":
      await getData(req, res);
      break;
  }
}

const getData = async (
  req: NextApiRequest,
  res: NextApiResponse<MyCryptosData>
) => {
  const assets = await prisma.asset.findMany();
  const wallet = await prisma.wallet.findFirst();

  const [coins, prices] = await Promise.all([
    axios
      .get("https://api.coingecko.com/api/v3/coins/markets", {
        params: {
          vs_currency: "pln",
          ids: assets.map((i) => i.key).join(","),
        },
      })
      .then((res) => res.data),

    axios
      .get("https://api.coingecko.com/api/v3/simple/price", {
        params: {
          vs_currencies: "pln,usd",
          ids: assets.map((i) => i.key).join(","),
        },
      })
      .then((res) => res.data),
  ]);

  const resItems = assets
    .map((item) => {
      const coin = coins.find((c: { id: string }) => c.id === item.key);
      const price = prices[item.key];

      return {
        ...item,
        id: item.key,
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
    pln: total.pln - (wallet?.deposit || 0),
  };

  res
    .status(200)
    .json({ paid: wallet?.deposit || 0, total, balance, items: resItems });
};
