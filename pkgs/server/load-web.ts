import { inspectTreeAsync, readAsync } from "fs-jetpack";
import { g } from "../utils/global";
import { dir } from "../utils/dir";

export const loadWeb = async () => {
  g.web = {};

  const list = await inspectTreeAsync(dir(`app/web`));
  for (const web of list?.children || []) {
    g.web[web.name] = {
      deploys: [],
      domains:
        (await readAsync(dir(`app/web/${web.name}/domains.json`), "json")) ||
        [],
      site_id: web.name,
    };
  }
};
