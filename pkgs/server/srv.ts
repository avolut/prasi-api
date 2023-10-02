export const apiContext = (ctx: any) => {
  return {
    req: ctx.req as Request,
    res: {
      ...ctx.res,
      send: (body) => {
        const status =
          typeof ctx.res._status === "number" ? ctx.res._status : undefined;
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

        const cur = ctx.res as Response;
        for (const [key, value] of cur.headers.entries()) {
          res.headers.append(key, value);
        }

        ctx.res = res;
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
