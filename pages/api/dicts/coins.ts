// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

import { Option, ResponseError } from "../../../shared/models/common";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ items: Option[] } | { msg: string }>
) {
  try {
    const items = await axios
      .get<{ coins: Array<{ id: string; name: string; symbol: string }> }>(
        "https://api.coingecko.com/api/v3/search",
        {
          params: {
            query: req.query.q,
          },
        }
      )
      .then((res) => res.data.coins);

    const resItems = items.map((item) => ({
      value: item.id,
      label: `${item.name} (${item.symbol})`,
    }));

    res.json({ items: resItems });
  } catch (e) {
    res.status(400).json({ msg: (e as ResponseError).message });
  }
}
