import { apiContext } from "service-srv";
import admin from "firebase-admin";
import { Database } from "bun:sqlite";

import { dir } from "utils/dir";
import { g } from "utils/global";
import { readAsync } from "fs-jetpack";

export const _ = {
  url: "/_notif/:action/:token",
  async api(
    action: string,
    data:
      | { type: "register"; token: string; id: string }
      | { type: "send"; id: string; body: string; title: string; data?: any }
  ) {
    const { req } = apiContext(this);
    if (!g.firebaseInit) {
      g.firebaseInit = true;

      try {
        g.firebase = admin.initializeApp({
          credential: admin.credential.cert(dir("firebase-admin.json")),
        });
        g.notif = {
          db: new Database(dir(`${g.datadir}/notif.sqlite`)),
        };

        g.notif.db.exec(`
          CREATE TABLE IF NOT EXISTS notif (
            token TEXT PRIMARY KEY,
            id TEXT NOT NULL
          );
        `);
      } catch (e) {
        console.error(e);
      }
    }

    if (g.firebase) {
      switch (action) {
        case "register":
          {
            if (data && data.type === "register" && data.token && data.id) {
              const q = g.notif.db.query(
                `SELECT * FROM notif WHERE token = '${data.token}'`
              );
              const result = q.all();
              if (result.length > 0) {
                g.notif.db.exec(
                  `UPDATE notif SET id = '${data.id}' WHERE token = '${data.token}'`
                );
              } else {
                g.notif.db.exec(
                  `INSERT INTO notif VALUES ('${data.token}', '${data.id}')`
                );
              }

              return { result: "OK" };
            }
          }
          break;
        case "send":
          {
            if (data && data.type === "send") {
              const q = g.notif.db.query<{ token: string }, any>(
                `SELECT * FROM notif WHERE id = '${data.id}'`
              );
              let result = q.all();
              for (const c of result) {
                try {
                  await g.firebase.messaging().send({
                    notification: { body: data.body, title: data.title },
                    data: data.data,
                    token: c.token,
                  });
                } catch (e) {
                  console.error(e);
                  result = result.filter((v) => v.token !== c.token);
                }
              }

              return { result: "OK", totalDevice: result.length };
            }
          }
          break;
      }
    }

    return { error: "missing ./firebase-admin.json" };
  },
};