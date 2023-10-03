import { createServer } from "./server/create";
import { createLogger } from "./utils/logger";
import { g } from "./utils/global";
import { PrismaClient } from "../app/db/db";
import { config } from "./utils/config";
import { prepareAPITypes } from "./server/prep-api-ts";

await config.init();

g.mode = process.argv.includes("dev") ? "dev" : "prod";
await createLogger();

g.log.info(g.mode === "dev" ? "DEVELOPMENT" : "PRODUCTION");
await createServer();

await prepareAPITypes();

g.db = new PrismaClient();
