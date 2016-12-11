'use strict';

const path = require('path');
const bucker = require('bucker');
const config = require('getconfig').watchers;

module.exports = (type, options = {}) => bucker.createLogger({
  console: {color: true},
  app: Object.assign({
    filename: path.resolve(__dirname, '..', '..', 'logs', `${type}.log`)
  }, config.logOptions, options)
});
