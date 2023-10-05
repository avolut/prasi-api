import { inspectTreeAsync, readAsync } from "fs-jetpack";
import { g } from "../utils/global";
import { dir } from "../utils/dir";

export const loadWeb = async () => {
  g.web = {};

  const list = await inspectTreeAsync(dir(`app/web`));
  for (const web of list?.children || []) {
    const deploy = web.children.find((e) => e.name === "deploys");

    g.web[web.name] = {
      current: parseInt(
        (await readAsync(dir(`app/web/${web.name}/current`))) || "0"
      ),
      deploys: deploy ? deploy.children.map((e) => parseInt(e.name)) : [],
      domains:
        (await readAsync(dir(`app/web/${web.name}/domains.json`), "json")) ||
        [],
      site_id: web.name,
      cacheKey: 0,
      cache: null,
    };
  }
};
