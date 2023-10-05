import { dirAsync, removeAsync, writeAsync } from "fs-jetpack";
import unzipper from "unzipper";
import { dirname } from "path";
import { dir } from "utils/dir";
import { $ } from "execa";
const res = await fetch(
  `https://github.com/avolut/prasi-api/archive/refs/heads/main.zip`,
  { method: "get" }
);

const data = await unzipper.Open.buffer(Buffer.from(await res.arrayBuffer()));

const promises: Promise<void>[] = [];
await removeAsync(dir("pkgs"));
for (const file of data.files) {
  if (file.type === "File") {
    const path = file.path.split("/").slice(1).join("/");
    if (path === "tsconfig.json" || path.startsWith("pkgs")) {
      promises.push(
        new Promise<void>(async (done) => {
          await dirAsync(dirname(dir(path)));
          await writeAsync(dir(path), await file.buffer());
          done();
        })
      );
    }
  }
}
await Promise.all(promises);

await $({ stdio: "inherit" })`bun i`;
