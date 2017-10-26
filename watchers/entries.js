'use strict';

require('dotenv').config();

const EntryWatcher = require('@lukekarrys/entry-watcher');
const config = require('getconfig');

const onSave = require('../lib/saveEntry');
const createLogger = require('../lib/logger');
const {sport, year, id} = require('../lib/sportYear');

const logger = createLogger(`entries-${id}`);

const watcher = new EntryWatcher({
  logger,
  onSave: onSave({logger, sport, year}),
  type: 'tweet',
  auth: config.twitter,
  sport,
  year,
  ...config.watchers.finder
});

watcher.start();
