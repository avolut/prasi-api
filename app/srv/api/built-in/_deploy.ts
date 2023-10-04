import { apiContext } from "service-srv";
import { dir } from "../../../../pkgs/utils/dir";

export const _ = {
  url: "/_deploy",
  async api(action: { type: "check"; id_site: string }) {
    const { req, res } = apiContext(this);
    switch (action.type) {
      case "check":
        return {
          domains: [],
          history: [],
        };
    }
  },
};
