declare module "exports" {
    export const _web: {
        name: string;
        url: string;
        path: string;
        args: string[];
        handler: Promise<any>;
    };
    export const _deploy: {
        name: string;
        url: string;
        path: string;
        args: string[];
        handler: Promise<any>;
    };
    export const _upload: {
        name: string;
        url: string;
        path: string;
        args: string[];
        handler: Promise<any>;
    };
    export const _prasi: {
        name: string;
        url: string;
        path: string;
        args: any[];
        handler: Promise<any>;
    };
    export const _file: {
        name: string;
        url: string;
        path: string;
        args: any[];
        handler: Promise<any>;
    };
    export const _api_frm: {
        name: string;
        url: string;
        path: string;
        args: any[];
        handler: Promise<any>;
    };
    export const _dbs: {
        name: string;
        url: string;
        path: string;
        args: string[];
        handler: Promise<any>;
    };
}
