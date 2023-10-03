import { createResponse } from "service-srv";
import { config } from "../utils/config";
import { g } from "../utils/global";

export const serveAPI = async (url: URL, req: Request) => {
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

    const body = await current.fn(...args);

    if (body) {
      return createResponse(current.res, body);
    }

    return current.res;
  }
};
