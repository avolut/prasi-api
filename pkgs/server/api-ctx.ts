import { g } from "../utils/global";

export const apiContext = (ctx: any) => {
  return {
    req: {
      ...ctx.req,
      get params() {
        const url = new URL(ctx.req.url);
        const found = g.router.lookup(url.pathname);
        return found?.params || { _: "" };
      },
      get query_parameters() {
        const pageHref = ctx.req.url;
        const searchParams = new URLSearchParams(
          pageHref.substring(pageHref.indexOf("?"))
        );

        return searchParams as any;
      },
    } as Request & { params: any; query_parameters: any },
    res: {
      ...ctx.res,
      send: (body) => {
        ctx.res = createResponse(ctx.res, body);
      },
      sendStatus: (code: number) => {
        ctx.res._status = code;
      },
      setHeader: (key: string, value: string) => {
        ctx.res.headers.append(key, value);
      },
    } as Response & {
      send: (body?: string | object) => void;
      setHeader: (key: string, value: string) => void;
      sendStatus: (code: number) => void;
    },
  };
};

export const createResponse = (existingRes: any, body: any) => {
  const status =
    typeof existingRes._status === "number" ? existingRes._status : undefined;
  const res = new Response(
    typeof body === "string" ? body : JSON.stringify(body),
    status
      ? {
          status,
        }
      : undefined
  );

  if (typeof body === "object") {
    res.headers.append("content-type", "application/json");
  }

  const cur = existingRes as Response;
  for (const [key, value] of cur.headers.entries()) {
    res.headers.append(key, value);
  }

  return res;
};
