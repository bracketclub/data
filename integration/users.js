'use strict';

const Generator = require('bracket-generator');

const {INITIAL, INTERVAL} = require('./interval');
const createLogger = require('../watchers/lib/logger');
const createSaveEntry = require('../watchers/lib/saveEntry');
const {id, sport, year} = require('../watchers/lib/sportYear');

const logger = createLogger(`users:${id}`);
const saveEntry = createSaveEntry({logger, sport, year});
const bracket = new Generator({sport, year});

const numbers = () => Math.random().toString().slice(2);

logger.log(`Starting user(5):${id} in ${INITIAL}`);

// User with multiple entries
setTimeout(() => setInterval(() => saveEntry({
  data_id: numbers(),
  user_id: '5',
  username: 'multi_entry',
  name: 'multi_entry',
  profile_pic: '',
  bracket: bracket.generate('random'),
  created: new Date().toJSON()
}), INTERVAL), INITIAL);
