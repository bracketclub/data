"use strict";

require("dotenv").config();

const config = require("getconfig");
const ScoreWatcher = require("./score-watcher");

const initialBracket = require("../lib/initialBracket");
const saveMaster = require("../lib/saveMaster");
const pgConnect = require("../lib/pgConnect");
const createLogger = require("../lib/logger");
const { sport, year, id } = require("../lib/sportYear");

const logger = createLogger(`scores-${id}`);

pgConnect(logger, (client, done) =>
  initialBracket({ logger, sport, year }, (err, master) => {
    if (err) {
      logger.error(`Error starting score watcher: ${err}`);
      return;
    }

    new ScoreWatcher({
      master,
      logger,
      onSave: saveMaster({ logger, sport, year }),
      scores: config.scores[sport],
      sport,
      year,
      ...config.watchers.finder,
    }).start();
  })
);
