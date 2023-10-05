import { writeFileSync } from "fs";
import { copyAsync, removeAsync, tmpDir } from "fs-jetpack";
import { dir } from "utils/dir";
import unzipper, { unzip } from "unzipper";
const res = await fetch(
  `https://github.com/avolut/prasi-api/archive/refs/heads/main.zip`,
  { method: "get" }
);

const data = await unzipper.Open.buffer(Buffer.from(await res.arrayBuffer()));

console.log(data.files);

// await removeAsync(dir(`pkgs`));
// await copyAsync(`${tmp}/pkgs`, dir(`pkgs`));

// await removeAsync(tmp);
