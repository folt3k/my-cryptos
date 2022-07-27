// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../shared";
import { ResponseError } from "../../../shared/models/common";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<object>
) {
  switch (req.method) {
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

const create = async (
  req: NextApiRequest,
  res: NextApiResponse<object | { msg: string }>
) => {
  if (!req.body.id || !req.body.amount) {
    return res.status(400).json({ msg: "Niepoprawne dane" });
  }

  try {
    await prisma.asset.create({
      data: {
        key: req.body.id,
        amount: req.body.amount,
      },
    });

    res.status(200).json({});
  } catch (e) {
    res.status(400).send({ msg: (e as ResponseError).message });
  }
};

const update = async (
  req: NextApiRequest,
  res: NextApiResponse<object | { msg: string }>
) => {
  try {
    const asset = await prisma.asset.findFirst({ where: { key: req.body.id } });

    if (asset) {
      await prisma.asset.update({
        where: { id: asset.id },
        data: {
          key: req.body.id,
          amount: req.body.amount,
        },
      });
    }

    res.status(200).json({});
  } catch (e) {
    res.status(400).send({ msg: (e as ResponseError).message });
  }
};

const remove = async (
  req: NextApiRequest,
  res: NextApiResponse<object | { msg: string }>
) => {
  try {
    const asset = await prisma.asset.findFirst({ where: { key: req.body.id } });
    await prisma.asset.delete({ where: { id: asset?.id } });

    res.status(200).json({});
  } catch (e) {
    res.status(400).send({ msg: (e as ResponseError).message });
  }
};
