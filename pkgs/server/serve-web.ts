import { g } from "../utils/global";

export const serveWeb = async (url: URL, req: Request) => {
  const domain = req.url.substring(0, req.url.length - url.pathname.length);
  let site_id = "";
  if (!g.domains) {
    g.domains = {};
    for (const web of Object.values(g.web)) {
      for (const d of web.domains) {
        g.domains[d] = web.site_id;
      }
    }
  }
  if (typeof g.domains[domain] === "undefined") {
    g.domains[domain] = "";
  }
  site_id = g.domains[domain];

  if (!site_id) {
    return false;
  }

  return new Response("NOT FOUND", { status: 404, statusText: "NOT FOUND" });
};
