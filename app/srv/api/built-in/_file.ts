import { apiContext } from "service-srv";
import { dir } from "../../../../pkgs/utils/dir";

export const _ = {
  url: "/_file/**",
  async api() {
    const { req } = apiContext(this);
    const rpath = decodeURIComponent(req.params._);
    const path = dir(`../data/upload/${rpath}`);
    return new Response(Bun.file(path));
  },
};
