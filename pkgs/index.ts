import { createServer } from "./server/create";
import { createLogger } from "./utils/logger";
import { g } from "./utils/global";
import { PrismaClient } from "../app/db/db";
import { config } from "./utils/config";

await config.init();

g.mode = process.argv.includes("dev") ? "dev" : "prod";
await createLogger();

g.log.info(g.mode === "dev" ? "DEVELOPMENT" : "PRODUCTION");
await createServer();

g.db = new PrismaClient();
