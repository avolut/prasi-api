import { inspectAsync, listAsync } from "fs-jetpack";
import { join } from "path";
import { createRouter } from "radix3";
import { dir } from "../utils/dir";
import { g } from "../utils/global";
import { parseArgs } from "./parse-args";
import { serveAPI } from "./serve-api";
import { serveWeb } from "./serve-web";

export const createServer = async () => {
  const apiDir = dir(`app/srv/api`);
  g.router = createRouter({ strictTrailingSlash: true });
  g.api = {};
  const scan = async (path: string) => {
    const apis = await listAsync(path);
    if (apis) {
      for (const file of apis) {
        const importPath = join(path, file);
        if (file.endsWith(".ts")) {
          try {
            const api = await import(importPath);
            let args: string[] = await parseArgs(importPath);
            const route = {
              url: api._.url,
              args,
              fn: api._.api,
              path: importPath.substring(apiDir.length + 1),
            };
            g.api[file] = route;
            g.router.insert(route.url, route);
          } catch (e) {
            g.log.warn(`Failed to import ${importPath}`);
          }
        } else {
          const dir = await inspectAsync(importPath);
          if (dir?.type === "dir") {
            await scan(importPath);
          }
        }
      }
    }
  };
  await scan(apiDir);

  g.server = Bun.serve({
    port: g.port,
    async fetch(req) {
      const url = new URL(req.url);

      const web = await serveWeb(url, req);
      if (web) {
        return web;
      }

      const api = await serveAPI(url, req);
      if (api) {
        return api;
      }

      return new Response(`Bun ${url.pathname}`);
    },
  });

  if (process.env.PRASI_MODE === "dev") {
    g.log.info(`http://localhost:${g.server.port}`);
  } else {
    g.log.info(`Started at port: ${g.server.port}`);
  }
};
