export const _prasi = {
  name: "_prasi",
  url: "/_prasi/**",
  path: "app/srv/api/built-in/_prasi.ts",
  args: [],
  handler: import("./api/built-in/_prasi")
}
export const _api_frm = {
  name: "_api_frm",
  url: "/_api_frm",
  path: "app/srv/api/built-in/_api_frm.ts",
  args: ["dbName","action"],
  handler: import("./api/built-in/_api_frm")
}
export const _dbs = {
  name: "_dbs",
  url: "/_dbs/:dbName/:action",
  path: "app/srv/api/built-in/_dbs.ts",
  args: ["dbName","action"],
  handler: import("./api/built-in/_dbs")
}
export const coba = {
  name: "coba",
  url: "/coba",
  path: "app/srv/api/coba.ts",
  args: ["arg"],
  handler: import("./api/coba")
}