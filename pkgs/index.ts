import { PrismaClient } from "../app/db/db";
import { generateAPIFrm } from "./server/api-frm";
import { createServer } from "./server/create";
import { prepareAPITypes } from "./server/prep-api-ts";
import { config } from "./utils/config";
import { g } from "./utils/global";
import { createLogger } from "./utils/logger";

g.db = new PrismaClient();
await g.db.$connect();

await config.init();

g.mode = process.argv.includes("dev") ? "dev" : "prod";
await createLogger();

g.log.info(g.mode === "dev" ? "DEVELOPMENT" : "PRODUCTION");
await createServer();

await generateAPIFrm();
await prepareAPITypes();


