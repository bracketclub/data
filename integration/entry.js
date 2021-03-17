'use strict';

require('dotenv').config();

const Generator = require('bracket-generator');

const createLogger = require('../lib/logger');
const createSaveEntry = require('../lib/saveEntry');
const {sport, year, id} = require('../lib/sportYear');

const logger = createLogger(`entry-${id}`);
const saveEntry = createSaveEntry({logger, sport, year});
const bracket = new Generator({sport, year});

const numbers = () => Math.random().toString().slice(2);
// eslint-disable-next-line no-magic-numbers
const letters = () => numbers().split('').map((n) => String.fromCharCode(parseInt(n, 10) + 65)).join('');

logger.log(`Adding entry: ${id}`);

const name = letters();

/* eslint-disable camelcase */
saveEntry({
  data_id: numbers(),
  user_id: numbers(),
  username: name,
  name,
  profile_pic: '',
  bracket: bracket.generate('random'),
  created: new Date().toJSON()
});
/* eslint-enable camelcase */
