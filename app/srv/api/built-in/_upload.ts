import { apiContext } from "service-srv";
import mp from "@surfy/multipart-parser";
import { dir } from "../../../../pkgs/utils/dir";
import { writeAsync } from "fs-jetpack";

export const _ = {
  url: "/_upload",
  async api(body: any) {
    const { req } = apiContext(this);
    let url = "";

    const raw = await req.text();
    const parts = mp(Buffer.from(raw)) as Record<
      string,
      { fileName: string; mime: string; type: string; buffer: Buffer }
    >;

    for (const [name, part] of Object.entries(parts)) {
      const d = new Date();
      const path = `${d.getFullYear()}-${d.getMonth()}/${d.getDate()}/${d.getTime()}-${part.fileName
        ?.replace(/\s+/g, "-")
        .toLowerCase()}`;

      url = `/_file/${path}`;
      await writeAsync(dir(`../prasi-data/upload/${path}`), part.buffer);
    }

    return url;
  },
};
function toArrayBuffer(buffer: Buffer) {
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );
}
