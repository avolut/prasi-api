import { statSync } from "fs";
import { join } from "path";
import { dir } from "utils/dir";
import { g } from "../utils/global";

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

  const base = dir(`app/static/site`);
  // const base = `/Users/r/Developer/prasi/.output/app/srv/site`;

  let path = join(base, url.pathname);

  try {
    const s = statSync(path);
    if (s.isFile()) {
      return new Response(Bun.file(path));
    }
  } catch (e) {}

  return [
    site_id,
    `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title></title>
  <link rel="stylesheet" href="https://prasi.app/index.css">
</head>
<body class="flex-col flex-1 w-full min-h-screen flex opacity-0">
  <div id="root"></div>
  <script src="/site.js" type="module"></script>
  <script>window.id_site = "${site_id}";</script>
</body>
</html>`,
  ];
};
