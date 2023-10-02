import { listAsync } from "fs-jetpack";
import { join } from "path";
import { createRouter } from "radix3";
import { dir } from "../utils/dir";
import { g } from "../utils/global";
import { parseArgs } from "./parse-args";

export const createServer = async () => {
  const apiDir = dir(`app/srv/api`);
  const apis = await listAsync(apiDir);
  g.router = createRouter({ strictTrailingSlash: false });
  g.api = {};
  if (apis) {
    for (const file of apis) {
      if (file.endsWith(".ts")) {
        const importPath = join(apiDir, file);

        try {
          const api = await import(importPath);

          let args: string[] = await parseArgs(importPath);
          const route = { url: api._.url, args, fn: api._.api };
          g.api[file] = route;
          g.router.insert(route.url, route);
        } catch (e) {
          g.log.warn(`Failed to import ${importPath}`);
        }
      }
    }
  }

  g.server = Bun.serve({
    async fetch(req) {
      const url = new URL(req.url);
      const found = g.router.lookup(url.pathname);

      if (found) {
        const params = { ...found.params };

        if (req.method !== "GET") {
          try {
            const json = await req.json();
            if (typeof json === "object") {
              for (const [k, v] of Object.entries(json)) {
                params[k] = v;
              }
            }
          } catch (e) {}
        }

        const current = {
          req,
          res: new Response(),
          ...found,
          params,
        };

        const args = found.args.map((e) => undefined);
        for (const [k, v] of Object.entries(params)) {
          const idx = found.args.findIndex((arg) => arg === k);
          if (idx >= 0) {
            args[idx] = v;
          }
        }

        await current.fn(...args);
        return current.res;
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
