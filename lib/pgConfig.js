"use strict";

const { postgres } = require("getconfig");

const SSL = "?sslmode=no-verify";
const PROD = process.env.NODE_ENV === "production";

module.exports = {
  connectionString: PROD && !postgres.endsWith(SSL) ? postgres + SSL : postgres,
};
