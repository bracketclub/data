"use strict";

const bracketData = require("bracket-data");

const latestBracket = require("../lib/latestBracket");
const pgConnect = require("./pgConnect");

module.exports = ({ sport, year, logger }, cb) => {
  const {
    constants: { EMPTY },
  } = bracketData({ sport, year });

  pgConnect(logger, (client, done) => {
    client.query(
      `INSERT INTO masters
      (bracket, created, sport)
      VALUES ($1, $2, $3);`,
      [EMPTY, new Date().toJSON(), sport],
      (insertErr) => {
        // Done with pg
        done();

        // The empty bracket already exists in the DB for this year, so we should return
        // the latest bracket
        if (
          insertErr &&
          insertErr.message.startsWith(
            "duplicate key value violates unique constraint"
          )
        ) {
          return latestBracket({ logger, sport, year }, cb);
        }

        // Some other unknown error occurred
        if (insertErr) {
          return cb(insertErr);
        }

        // If we successfully inserted the base empty bracket
        return cb(null, EMPTY);
      }
    );
  });
};
