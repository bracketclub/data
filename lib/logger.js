"use strict";

const path = require("path");
const _ = require("lodash");
const bucker = require("bucker");
const config = require("getconfig").watchers.logOptions;

const isPm2 = !!process.env.PM2_ENV;

module.exports = (type, options = {}) => {
  const filenameKey = "app.file.filename";
  const filename = _.get(config, filenameKey);

  if (_.isString(filename)) {
    _.set(
      config,
      filenameKey,
      path.resolve(process.cwd(), filename.replace(":type", type))
    );
  }

  if (isPm2) {
    // pm2 handles it own logs so we dont need to write to a file
    _.set(config, filenameKey.split(".").slice(0, -1).join("."), false);
  }

  return bucker.createLogger(config);
};
