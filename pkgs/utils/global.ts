import { Server } from "bun";
import { Logger } from "pino";
import { RadixRouter } from "radix3";
import { PrismaClient } from "../../app/db/db";

type SingleRoute = {
  url: string;
  args: string[];
  fn: (...arg: any[]) => Promise<any>;
};

export const g = global as unknown as {
  db: PrismaClient;
  mode: "dev" | "prod";
  server: Server;
  log: Logger;
  api: Record<string, SingleRoute>;
  router: RadixRouter<SingleRoute>;
};
