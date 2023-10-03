import { apiContext } from "../../../../pkgs/server/api-ctx";
import { execQuery } from "../../../../pkgs/utils/query";

export const _ = {
  url: "/_dbs/:dbName/:action",
  async api(dbName: any, action?: string) {
    const { req, res } = apiContext(this);

    const body = req.params;

    try {
      const result = await execQuery(body, db);
      res.send(result);
    } catch (e: any) {
      res.sendStatus(500);
      console.error(e);
      res.send(e);
      console.error(e);
    }
  },
};
