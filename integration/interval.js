/* eslint no-magic-numbers:0 */

"use strict";

const { argv } = require("yargs").number("interval").default("interval", 5000);

module.exports = {
  INTERVAL: argv.interval,
};
