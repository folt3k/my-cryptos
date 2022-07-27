// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../shared";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<object>
) {
  switch (req.method) {
    case "PUT":
      await update(req, res);
      break;
  }
}

const update = async (
  req: NextApiRequest,
  res: NextApiResponse<object | { msg: string }>
) => {
  if (req.body.value === null || req.body.value === undefined) {
    res.status(400).send({ msg: "Brakuje wartości" });
  }

  try {
    const wallet = await prisma.wallet.findFirst();

    if (wallet) {
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: { deposit: req.body.value },
      });
    } else {
      await prisma.wallet.create({
        data: { deposit: req.body.value },
      });
    }

    res.status(200).json({});
  } catch (e) {
    console.log(e);

    res.status(400).send({ msg: e });
  }
};
