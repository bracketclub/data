'use strict';

const path = require('path');
const bucker = require('bucker');
const config = require('getconfig').watchers.logOptions;

const isPm2 = !!process.env.PM2_ENV;

module.exports = (type, options = {}) => {
  if (typeof config.file === 'string') {
    config.file = path.resolve(process.cwd(), config.file.replace(':type', type));
  }

  if (isPm2) {
    // pm2 handles it own logs so we dont need to write to a file
    config.file = false;
  }

  return bucker.createLogger({
    console: {color: true},
    app: {...config, ...options}
  });
};
