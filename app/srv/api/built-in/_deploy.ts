import { apiContext } from "service-srv";
import { dir } from "../../../../pkgs/utils/dir";

export const _ = {
  url: "/_deploy",
  async api(action: { type: "check" }) {
    const { req, res } = apiContext(this);
    switch (action.type) {
      case "check":
        res.send({ deployed: {} });
        break;
    }
  },
};
