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

logger.log(`Adding entry: ${id}`);

/* eslint-disable camelcase */
saveEntry({
  data_id: numbers(),
  user_id: '1107677430418800642',
  username: 'lukekarrys',
  name: 'lukekarrys',
  profile_pic: '',
  bracket: bracket.generate('random'),
  created: new Date().toJSON()
});
/* eslint-enable camelcase */
