import { readAsync } from "fs-jetpack";
import { apiContext } from "../../../../pkgs/server/api-ctx";
import { g } from "../../../../pkgs/utils/global";
import { dir } from "../../../../pkgs/utils/dir";

const cache = {
  src: "",
};

export const _ = {
  url: "/_prasi/**",
  async api() {
    const { req, res } = apiContext(this);
    res.setHeader("Access-Control-Allow-Origin", "*");

    const action = {
      _: () => {
        res.send({ prasi: "v2" });
      },
      "load.js": async () => {
        res.setHeader("content-type", "text/javascript");
        const url = req.query_parameters["url"]
          ? JSON.stringify(req.query_parameters["url"])
          : "undefined";

        // cache.src = await getApiTypes();

        if (!cache.src) {
          cache.src = `\
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
    apiTypes: ${JSON.stringify((await getApiTypes()) || "")},
    prismaTypes: {
      "prisma.d.ts": ${await getPrisma("prisma")},
      "runtime/index.d.ts": ${await getPrisma("runtime")},
      "runtime/library.d.ts": ${await getPrisma("library")},
    },
  };
})();`;
        }
        res.send(cache.src);
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

const getApiTypes = async () => {
  return (
    `\
declare module "gen/srv/api/entry" {
    export * as srv from "gen/srv/api/srv";
}
  
` +
    ((await readAsync(dir("app/srv/exports.d.ts"))) || "")
      .replace(/\"app\/srv\/api/gi, '"srv/api')
      .replace(
        'declare module "app/srv/exports"',
        'declare module "gen/srv/api/srv"'
      )
  );
};

const getPrisma = async (path: string) => {
  if (path === "prisma")
    return JSON.stringify(
      (
        (await readAsync(dir("node_modules/.prisma/client/index.d.ts"))) || ""
      ).replace(`@prisma/client/runtime/library`, `./runtime/library`)
    );

  if (path === "runtime")
    return JSON.stringify(
      await readAsync(
        dir("node_modules/@prisma/client/runtime/index-browser.d.ts")
      )
    );

  if (path === "library")
    return JSON.stringify(
      await readAsync(dir("node_modules/@prisma/client/runtime/library.d.ts"))
    );

  return JSON.stringify({});
};
