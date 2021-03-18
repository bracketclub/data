"use strict";

const pgConnect = require("./pgConnect");

module.exports = ({ logger, sport }) => (master, cb) =>
  pgConnect(logger, (client, done) =>
    client.query(
      `INSERT INTO masters
  (bracket, created, sport)
  VALUES ($1, $2, $3);`,
      [master, new Date().toJSON(), sport],
      (err) => {
        if (err) {
          logger.error(`masters error: ${err}`);
          done(err);
          cb(err);
          return;
        }

        logger.info(`masters success: ${master}`);

        client.query(
          `NOTIFY masters, '${sport}-${new Date().getFullYear()}';`,
          (notifyErr) => {
            done(notifyErr);
            logger.info(`notify masters: ${notifyErr || "Success"}`);
            cb(null, master);
          }
        );
      }
    )
  );
