import { removeAsync, tmpDir } from "fs-jetpack";
import { writeFileSync } from "fs";
import { dirname } from "path";
const res = await fetch(
  `https://github.com/avolut/prasi-api/archive/refs/heads/main.zip`,
  { method: "get" }
);

const tmp = tmpDir().path();
const path = `${tmp}/prasi-api.zip`;
writeFileSync(path, await res.arrayBuffer());

await removeAsync(tmp);
