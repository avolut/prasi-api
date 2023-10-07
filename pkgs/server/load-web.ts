import { gunzipSync } from "zlib";
import { existsAsync, inspectTreeAsync, readAsync } from "fs-jetpack";
import { dir } from "../utils/dir";
import { g } from "../utils/global";
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
      deploying: null,
      cacheKey: 0,
      cache: null,
    };

    const cur = g.web[web.name];
    if (!cur.deploys.includes(cur.current)) {
      cur.current = 0;
    }
    if (cur.current) {
      await loadWebCache(cur.site_id, cur.current);
    }
  }
};

const decoder = new TextDecoder();
export const loadWebCache = async (site_id: string, ts: number | string) => {
  const web = g.web[site_id];
  if (web) {
    const path = dir(`app/web/${site_id}/deploys/${ts}`);
    if (await existsAsync(path)) {
      const fileContent = await readAsync(path, "buffer");
      if (fileContent) {
        console.log(
          `Loading site ${site_id}: ${humanFileSize(fileContent.byteLength)}`
        );

        const res = gunzipSync(fileContent);
        web.cache = JSON.parse(decoder.decode(res));
      }
    }
  }
};

function humanFileSize(bytes: any, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}
