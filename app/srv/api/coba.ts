import { apiContext } from "../../../pkgs/server/api-ctx";

export const _ = {
  url: "/coba",
  async api(arg: {
    site_id: string;
    page_id: string;
    item_id: string;
    comp_id: string;
  }) {
    const { req, res } = apiContext(this);

    console.log(process.env.DATABASE_URL);

    res.send({ moko: "mantap jiwa" });
  },
};
