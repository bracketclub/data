'use strict';

const Generator = require('bracket-generator');

const createLogger = require('../lib/logger');
const createSaveEntry = require('../lib/saveEntry');
const {id, sport, year} = require('../lib/sportYear');

const logger = createLogger(`users:${id}`);
const saveEntry = createSaveEntry({logger, sport, year});
const bracket = new Generator({sport, year});

const INITIAL = 5000;
const INTERVAL = 5000;

const numbers = () => Math.random().toString().slice(2);

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
