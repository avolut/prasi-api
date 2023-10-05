import { apiContext } from "service-srv";
import { dir } from "utils/dir";
import { dirAsync, writeAsync } from "fs-jetpack";
import { g } from "utils/global";
import { $ } from "execa";
import { restartServer } from "utils/restart";
export const _ = {
  url: "/_deploy",
  async api(
    action: (
      | { type: "check" }
      | { type: "db-update"; url: string }
      | { type: "db-pull" }
      | { type: "restart" }
      | { type: "domain-add"; domain: string }
      | { type: "domain-del"; domain: string }
    ) & {
      id_site: string;
    }
  ) {
    const { req, res } = apiContext(this);

    if (!g.web[action.id_site]) {
      g.web[action.id_site] = {
        domains: [],
        deploys: [],
        site_id: action.id_site,
      };
    }
    const path = `app/web/${action.id_site}`;
    await dirAsync(path);

    const web = g.web[action.id_site];

    switch (action.type) {
      case "check":
        return {
          domains: web.domains,
          deploys: web.deploys,
          db: {
            url: g.dburl || "-",
          },
        };
      case "db-update":
        if (action.url) {
          g.dburl = action.url;
          await writeAsync(
            dir(".env"),
            `\
DATABASE_URL="${action.url}"
PORT=${g.port}`
          );
        }
        return "ok";
      case "db-pull":
        {
          await $({ cwd: dir("app/db") })`bun prisma db pull`;
          await $({ cwd: dir("app/db") })`bun prisma generate`;
          res.send("ok");
          setTimeout(() => {
            restartServer();
          }, 300);
        }
        break;
      case "restart":
        {
          res.send("ok");
          setTimeout(() => {
            restartServer();
          }, 300);
        }
        break;
      case "domain-add":
        {
          web.domains.push(action.domain);
          await writeAsync(dir(`${path}/domains.json`), web.domains);
          g.domains = null;
          res.send("ok");
        }
        break;
      case "domain-del":
        {
          web.domains = web.domains.filter((e) => e !== action.domain);
          await writeAsync(dir(`${path}/domains.json`), web.domains);
          g.domains = null;

          res.send("ok");
        }
        break;
    }
  },
};
