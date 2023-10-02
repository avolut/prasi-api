import { apiContext } from "service-srv";

export const _ = {
  url: "/_dbs/:dbName/:action",
  async api(dbName: any, action?: string) {
    const { req, res } = apiContext(this);

    console.log(dbName, action);
  },
};
