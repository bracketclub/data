#!/usr/bin/env node

"use strict";

require("dotenv").config();

const config = require("getconfig");
const yargs = require("yargs");
const EntryWatcher = require("../watchers/entry-watcher");

const onSave = require("../lib/saveEntry");
const createLogger = require("../lib/logger");
const { sport, year, id } = require("../lib/sportYear");

const logger = createLogger(`find-entry-${id}`);

const usage = "Usage: $0 --tweet [TWEET_ID] --sport [SPORT] --year [YEAR]";

const { tweet } = yargs
  .usage(usage)
  // Tweet
  .string("tweet")
  .require("tweet")
  .describe("tweet", "Check if this tweet contains an entry").argv;

const watcher = new EntryWatcher({
  logger,
  onSave: onSave({ logger, sport, year }),
  type: "tweet",
  auth: config.twitter,
  sport,
  year,
  ...config.watchers.finder,
});

watcher.find(tweet);
