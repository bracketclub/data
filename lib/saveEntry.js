"use strict";

const _ = require("lodash");
const async = require("async");
const pgConnect = require("./pgConnect");

module.exports = ({ logger, sport }) => (data) =>
  pgConnect(logger, (client, done) => {
    const queryCb = (type, logData, cb) => (err, res) => {
      if (err) {
        logger.error(`${type} error: ${err}`);
        cb(err);
        return;
      }

      logger.info(`${type} success: ${JSON.stringify(logData)}`);
      cb(null);
    };

    const year = new Date(data.created).getFullYear();

    async.series(
      [
        (cb) =>
          client.query(
            `INSERT INTO users
      (id, username, name, profile_pic)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id) DO UPDATE SET
      ${["username", "name", "profile_pic"]
        .map((k) => `${k} = EXCLUDED.${k}`)
        .join(", ")};`,
            [data.user_id, data.username, data.name, data.profile_pic],
            queryCb("user", _.pick(data, "username"), cb)
          ),
        (cb) =>
          client.query(
            `INSERT INTO entries
      (id, bracket, "user", created, sport)
      VALUES ($1, $2, $3, $4, $5);`,
            [data.data_id, data.bracket, data.user_id, data.created, sport],
            queryCb("entry", _.pick(data, "bracket", "username"), cb)
          ),
      ],
      (err) => {
        if (err) {
          done(err);
          return;
        }

        const entryPayload = { event: `${sport}-${year}` };
        const userPayload = { id: data.user_id, event: `${sport}-${year}` };

        async.parallel(
          [
            (cb) =>
              client.query(
                `NOTIFY entries, '${JSON.stringify(entryPayload)}';`,
                cb
              ),
            (cb) =>
              client.query(
                `NOTIFY users, '${JSON.stringify(userPayload)}';`,
                cb
              ),
          ],
          (notifyErr) => {
            done(notifyErr);
            logger.info(`notify entries, users: ${notifyErr || "Success"}`);
          }
        );
      }
    );
  });
