import { $ } from "execa";
import * as fs from "fs";
import { dirAsync, writeAsync } from "fs-jetpack";
import { apiContext } from "service-srv";
import { dir } from "utils/dir";
import { g } from "utils/global";
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
      | { type: "deploy"; dlurl: string }
      | { type: "redeploy"; ts: string }
    ) & {
      id_site: string;
    }
  ) {
    const { req, res } = apiContext(this);

    if (!g.web[action.id_site]) {
      g.web[action.id_site] = {
        current: 0,
        domains: [],
        deploys: [],
        site_id: action.id_site,
        cacheKey: 0,
        cache: null,
      };
    }
    const path = `app/web/${action.id_site}`;
    await dirAsync(path);

    const web = g.web[action.id_site];

    switch (action.type) {
      case "check":
        return {
          now: Date.now(),
          current: web.current,
          deploys: web.deploys,
          domains: web.domains,
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
      case "deploy":
        {
          await fs.promises.mkdir(`${path}/deploys`, { recursive: true });
          const cur = Date.now();
          const filePath = `${path}/deploys/${cur}`;
          if (await downloadFile(action.dlurl, filePath)) {
            await fs.promises.writeFile(`${path}/current`, cur.toString());
            web.current = cur;
            web.deploys.push(cur);
          }
          return {
            now: Date.now(),
            current: web.current,
            deploys: web.deploys,
          };
        }
        break;
      case "redeploy":
        {
          const cur = parseInt(action.ts);
          if (web.deploys.find((e) => e === cur)) {
            web.current = cur;
            await fs.promises.writeFile(`${path}/current`, cur.toString());
          }

          return {
            now: Date.now(),
            current: web.current,
            deploys: web.deploys,
          };
        }
        break;
    }
  },
};

const downloadFile = async (url: string, filePath: string) => {
  try {
    const _url = new URL(url);
    if (_url.hostname === "localhost") {
      _url.hostname = "127.0.0.1";
    }
    const response = await fetch(_url);
    if (response.body) {
      const blobData = await Bun.readableStreamToBlob(response.body);
      await Bun.write(filePath, blobData);
    }
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
