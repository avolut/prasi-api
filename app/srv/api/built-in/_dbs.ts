import { apiContext } from "../../../../pkgs/server/api-ctx";

export const _ = {
  url: "/_dbs/:dbName/:action",
  async api(dbName: any, action?: string) {
    const { req, res } = apiContext(this);

    console.log(dbName, action);
  },
};
