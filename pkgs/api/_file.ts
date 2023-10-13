import { apiContext } from "service-srv";
import { dir } from "utils/dir";
import { g } from "utils/global";

export const _ = {
  url: "/_file/**",
  async api() {
    const { req } = apiContext(this);
    const rpath = decodeURIComponent(req.params._);
    const path = dir(`${g.datadir}/upload/${rpath}`);

    try {
      return new Response(Bun.file(path));
    } catch (e) {
      return new Response("NOT FOUND", { status: 404 });
    }
  },
};
