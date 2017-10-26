'use strict';

const path = require('path');
const bucker = require('bucker');
const config = require('getconfig').watchers.logOptions;

module.exports = (type, options = {}) => {
  if (typeof config.file === 'string') {
    config.file = path.resolve(process.cwd(), config.file.replace(':type', type));
  }

  return bucker.createLogger({
    console: {color: true},
    app: {...config, ...options}
  });
};
