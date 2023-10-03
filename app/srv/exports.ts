export const _upload = {
  name: "_upload",
  url: "/_upload",
  path: "app/srv/api/built-in/_upload.ts",
  args: ["body"],
  handler: import("./api/built-in/_upload")
}
export const _prasi = {
  name: "_prasi",
  url: "/_prasi/**",
  path: "app/srv/api/built-in/_prasi.ts",
  args: [],
  handler: import("./api/built-in/_prasi")
}
export const _file = {
  name: "_file",
  url: "/_file/**",
  path: "app/srv/api/built-in/_file.ts",
  args: [],
  handler: import("./api/built-in/_file")
}
export const _api_frm = {
  name: "_api_frm",
  url: "/_api_frm",
  path: "app/srv/api/built-in/_api_frm.ts",
  args: [],
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