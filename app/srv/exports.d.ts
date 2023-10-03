declare module "app/db/db" {
    
}
declare module "pkgs/utils/global" {
    import { Logger } from "pino";
    import { RadixRouter } from "radix3";
    
    type SingleRoute = {
        url: string;
        args: string[];
        fn: (...arg: any[]) => Promise<any>;
        path: string;
    };
    export const g: {
        
        mode: "dev" | "prod";
        
        log: Logger;
        api: Record<string, SingleRoute>;
        web: Record<string, {
            site_id: string;
            secret: string;
        }>;
        router: RadixRouter<SingleRoute>;
        frm: {
            js: string;
            etag: string;
        };
    };
}
declare module "pkgs/server/api-ctx" {
    export const apiContext: (ctx: any) => {
        req: Request & {
            params: any;
            query_parameters: any;
        };
        res: Response & {
            send: (body?: string | object) => void;
            setHeader: (key: string, value: string) => void;
            sendStatus: (code: number) => void;
        };
    };
    export const createResponse: (existingRes: any, body: any) => Response;
}
declare module "pkgs/utils/dir" {
    export const dir: (path: string) => any;
}
declare module "app/srv/api/built-in/_prasi" {
    export const _: {
        url: string;
        api(): Promise<void>;
    };
}
declare module "app/srv/api/built-in/_api_frm" {
    export const _: {
        url: string;
        api(dbName: any, action?: string): Promise<void>;
    };
}
declare module "pkgs/utils/query" {
    export type DBArg = {
        db: string;
        table: string;
        action: string;
        params: any[];
    };
    export const execQuery: (args: DBArg, prisma: any) => Promise<any>;
}
declare module "app/srv/api/built-in/_dbs" {
    export const _: {
        url: string;
        api(dbName: any, action?: string): Promise<void>;
    };
}
declare module "app/srv/api/coba" {
    export const _: {
        url: string;
        api(arg: {
            site_id: string;
            page_id: string;
            item_id: string;
            comp_id: string;
        }): Promise<void>;
    };
}
declare module "app/srv/exports" {
    export const _prasi: {
        name: string;
        url: string;
        path: string;
        args: any[];
        handler: Promise<typeof import("app/srv/api/built-in/_prasi")>;
    };
    export const _api_frm: {
        name: string;
        url: string;
        path: string;
        args: string[];
        handler: Promise<typeof import("app/srv/api/built-in/_api_frm")>;
    };
    export const _dbs: {
        name: string;
        url: string;
        path: string;
        args: string[];
        handler: Promise<typeof import("app/srv/api/built-in/_dbs")>;
    };
    export const coba: {
        name: string;
        url: string;
        path: string;
        args: string[];
        handler: Promise<typeof import("app/srv/api/coba")>;
    };
}
