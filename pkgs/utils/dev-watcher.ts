import { file } from "bun";
import { watch } from "fs";
import { dir } from "./dir";
import { dirAsync, writeAsync } from "fs-jetpack";

export const startDevWatcher = async () => {
  await dirAsync(dir(`app/srv/api`));
  watch(dir(`app/srv/api`), async (event, filename) => {
    const s = file(dir(`app/srv/api/${filename}`));
    if (s.size === 0) {
      await writeAsync(
        `app/srv/api/${filename}`,
        `\
import { apiContext } from "service-srv";

export const _ = {
  url: "/${filename?.substring(0, filename.length - 3)})}",
  async api() {
    const { req, res } = apiContext(this);
    return "This is ${filename}";
  }
}`
      );
    }
  });
};
