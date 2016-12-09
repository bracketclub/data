'use strict';

const path = require('path');
const bucker = require('bucker');
const config = require('getconfig').watchers;

const createLogger = (type) => bucker.createLogger({
  console: {color: true},
  app: Object.assign({
    filename: path.resolve(__dirname, '..', '..', 'logs', `${type}.log`)
  }, config.logOptions)
});

module.exports = createLogger;
