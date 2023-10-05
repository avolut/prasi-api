import { connect, listen } from "bun";
import { PrismaClient } from "../app/db/db";
import { generateAPIFrm } from "./server/api-frm";
import { createServer } from "./server/create";
import { prepareAPITypes } from "./server/prep-api-ts";
import { config } from "./utils/config";
import { g } from "./utils/global";
import { createLogger } from "./utils/logger";
import { loadWeb } from "./server/load-web";

g.db = new PrismaClient();
g.dburl = process.env.DATABASE_URL || "";
g.port = parseInt(process.env.PORT || "3000");
await createLogger();

await new Promise<void>(async (resolve) => {
  const checkPort = () => {
    return new Promise<boolean>(async (done) => {
      try {
        const s = await connect({
          hostname: "0.0.0.0",
          port: g.port,
          socket: {
            open(socket) {},
            data(socket, data) {},
            close(socket) {},
            drain(socket) {},
            error(socket, error) {},
          },
        });
        s.end();
        done(false);
      } catch (e) {
        done(true);
      }
    });
  };

  if (!(await checkPort())) {
    g.log.warn(`Port ${3000} is used, waiting...`);
    setInterval(async () => {
      if (await checkPort()) resolve();
    }, 500);
  } else {
    resolve();
  }
});

await g.db.$connect();

await config.init();
await loadWeb();

g.mode = process.argv.includes("dev") ? "dev" : "prod";

g.log.info(g.mode === "dev" ? "DEVELOPMENT" : "PRODUCTION");
await createServer();

await generateAPIFrm();
await prepareAPITypes();
