"use strict";

require("dotenv").config();

const Generator = require("bracket-generator");

const createLogger = require("../lib/logger");
const createSaveEntry = require("../lib/saveEntry");
const { sport, year, id } = require("../lib/sportYear");

const logger = createLogger(`entry-${id}`);
const saveEntry = createSaveEntry({ logger, sport, year });
const bracket = new Generator({ sport, year });

const numbers = () => Math.random().toString().slice(2);

// eslint-disable-next-line no-unused-vars
const letters = () =>
  numbers()
    .split("")
    // eslint-disable-next-line no-magic-numbers
    .map((n) => String.fromCharCode(parseInt(n, 10) + 65))
    .join("");

logger.log(`Adding entry: ${id}`);

const name = "lukekarrys";

/* eslint-disable camelcase */
saveEntry({
  data_id: numbers(),
  user_id: "1107677430418800642",
  username: name,
  name,
  profile_pic: "",
  bracket: bracket.generate("random"),
  created: new Date().toJSON(),
});
/* eslint-enable camelcase */
