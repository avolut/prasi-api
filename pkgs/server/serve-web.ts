import { g } from "../utils/global";
import { join } from "path";
import { statSync } from "fs";
import { readAsync } from "fs-jetpack";

export const serveWeb = async (url: URL, req: Request) => {
  const domain = url.hostname;
  let site_id = "";
  if (!g.domains) {
    g.domains = {};
    for (const web of Object.values(g.web)) {
      for (const d of web.domains) {
        const durl = new URL(d);
        g.domains[durl.hostname] = web.site_id;
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

  const base = `/Users/r/Developer/prasi/.output/app/srv/site`;

  let path = join(base, url.pathname);

  try {
    const s = statSync(path);
    if (s.isFile()) {
      return new Response(Bun.file(path));
    }
  } catch (e) {}

  const index = await readAsync(join(base, "index.html"));
  if (index) {
    return index.replace(
      "</body>",
      `<script>window.id_site = "${site_id}";</script></body>`
    );
  }
};
