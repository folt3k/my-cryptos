/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.

import { PrismaClient } from "@prisma/client";
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient;
}
