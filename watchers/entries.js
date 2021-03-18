"use strict";

require("dotenv").config();

const EntryWatcher = require("@lukekarrys/entry-watcher");
const config = require("getconfig");

const initialBracket = require("../lib/initialBracket");
const onSave = require("../lib/saveEntry");
const pgConnect = require("../lib/pgConnect");
const createLogger = require("../lib/logger");
const { sport, year, id } = require("../lib/sportYear");

const logger = createLogger(`entries-${id}`);

pgConnect(logger, (client, done) =>
  initialBracket({ logger, sport, year }, (err) => {
    if (err) {
      logger.error(`Error starting entries watcher: ${err}`);
      return;
    }

    new EntryWatcher({
      logger,
      onSave: onSave({ logger, sport, year }),
      type: "tweet",
      auth: config.twitter,
      sport,
      year,
      ...config.watchers.finder,
    }).start();
  })
);
