'use strict';

const Generator = require('bracket-generator');

const {INTERVAL} = require('./interval');
const createLogger = require('../lib/logger');
const createSaveEntry = require('../lib/saveEntry');
const {id, sport, year} = require('../lib/sportYear');

const logger = createLogger(`users:${id}`);
const saveEntry = createSaveEntry({logger, sport, year});
const bracket = new Generator({sport, year});

const numbers = () => Math.random().toString().slice(2);

logger.log(`Starting user(5):${id}`);

// User with multiple entries
setInterval(() => saveEntry({
  data_id: numbers(),
  user_id: '5',
  username: 'multi_entry',
  name: 'multi_entry',
  profile_pic: '',
  bracket: bracket.generate('random'),
  created: new Date().toJSON()
}), INTERVAL);
