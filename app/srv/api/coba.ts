import { apiContext } from "service-srv";

export const _ = {
  url: "/coba",
  async api(arg: {
    site_id: string;
    page_id: string;
    item_id: string;
    comp_id: string;
  }) {
    const { req, res } = apiContext(this);

    console.log(arg);
    res.send({ moko: "mantap jiwa" });
  },
};
