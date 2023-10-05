declare module "pkgs/utils/dir" {
    export const dir: (path: string) => string;
}
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
        
        dburl: string;
        mode: "dev" | "prod";
        
        log: Logger;
        api: Record<string, SingleRoute>;
        domains: null | Record<string, string>;
        web: Record<string, {
            site_id: string;
            deploys: number[];
            domains: string[];
        }>;
        router: RadixRouter<SingleRoute>;
        port: number;
        frm: {
            js: string;
            etag: string;
        };
    };
}
declare module "pkgs/utils/restart" {
    export const restartServer: () => never;
}
declare module "app/srv/api/built-in/_deploy" {
    export const _: {
        url: string;
        api(action: ({
            type: "check";
        } | {
            type: "db-update";
            url: string;
        } | {
            type: "db-pull";
        } | {
            type: "restart";
        } | {
            type: "domain-add";
            domain: string;
        } | {
            type: "domain-del";
            domain: string;
        }) & {
            id_site: string;
        }): Promise<"ok" | {
            domains: string[];
            deploys: number[];
            db: {
                url: string;
            };
        }>;
    };
}
declare module "app/srv/api/built-in/_upload" {
    export const _: {
        url: string;
        api(body: any): Promise<string>;
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
declare module "app/srv/api/built-in/_prasi" {
    export const _: {
        url: string;
        api(): Promise<void>;
    };
}
declare module "app/srv/api/built-in/_file" {
    export const _: {
        url: string;
        api(): Promise<Response>;
    };
}
declare module "app/srv/api/built-in/_api_frm" {
    export const _: {
        url: string;
        api(): Promise<void>;
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
    export const _deploy: {
        name: string;
        url: string;
        path: string;
        args: string[];
        handler: Promise<typeof import("app/srv/api/built-in/_deploy")>;
    };
    export const _upload: {
        name: string;
        url: string;
        path: string;
        args: string[];
        handler: Promise<typeof import("app/srv/api/built-in/_upload")>;
    };
    export const _prasi: {
        name: string;
        url: string;
        path: string;
        args: any[];
        handler: Promise<typeof import("app/srv/api/built-in/_prasi")>;
    };
    export const _file: {
        name: string;
        url: string;
        path: string;
        args: any[];
        handler: Promise<typeof import("app/srv/api/built-in/_file")>;
    };
    export const _api_frm: {
        name: string;
        url: string;
        path: string;
        args: any[];
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
