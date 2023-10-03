import { apiContext } from "../../../../pkgs/server/api-ctx";
import { existsAsync, readAsync, writeAsync } from "fs-jetpack";
import { dir } from "../../../../pkgs/utils/dir";
import { g } from "../../../../pkgs/utils/global";
export const _ = {
  url: "/_prasi/**",
  async api() {
    const { req, res } = apiContext(this);

    const action = {
      _: () => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.send({ prasi: "v2" });
      },
      "load.js": async () => {
        res.setHeader("content-type", "text/javascript");
        const url = req.query_parameters["url"]
          ? JSON.stringify(req.query_parameters["url"])
          : "undefined";
        res.send(`\
(() => {
  const baseurl = new URL(location.href);
  baseurl.pathname = '';
  const url = ${url} || baseurl.toString();
  const w = window;
  if (!w.prasiApi) {
    w.prasiApi = {};
  }
  w.prasiApi[url] = {
    apiEntry: ${getApiEntry()},
    apiTypes: ${getApiTypes()},
    prismaTypes: {
      "prisma.d.ts": ${getPrisma("prisma")},
      "runtime/index.d.ts": ${getPrisma("runtime")},
      "runtime/library.d.ts": ${getPrisma("library")},
    },
  };
})();`);
      },
    };

    const pathname: keyof typeof action = req.params._.split("/")[0] as any;
    const run = action[pathname];

    if (run) {
      await run();
    }
  },
};

const getApiEntry = () => {
  const res: any = {};
  for (const [k, v] of Object.entries(g.api)) {
    const name = k.substring(0, k.length - 3);
    res[name] = { ...v, name, path: `app/srv/api/${v.path}` };
  }

  return JSON.stringify(res);
};

const getApiTypes = () => {
  return '""';
};

const getPrisma = (path: string) => {
  return JSON.stringify({});
};
