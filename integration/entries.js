'use strict';

require('dotenv').config();

const Generator = require('bracket-generator');

const {INTERVAL} = require('./interval');
const createLogger = require('../lib/logger');
const createSaveEntry = require('../lib/saveEntry');
const {sport, year, id} = require('../lib/sportYear');

const logger = createLogger(`entries:${id}`);
const saveEntry = createSaveEntry({logger, sport, year});
const bracket = new Generator({sport, year});

const A = 65;
const numbers = () => Math.random().toString().slice(2);
const letters = () => numbers().split('').map((n) => String.fromCharCode(parseInt(n, 10) + A)).join('');

logger.log(`Starting entries:${id}`);

/* eslint-disable camelcase */
setInterval(() => saveEntry({
  data_id: numbers(),
  user_id: numbers(),
  username: letters(),
  name: letters(),
  profile_pic: '',
  bracket: bracket.generate('random'),
  created: new Date().toJSON()
}), INTERVAL);
/* eslint-enable camelcase */
