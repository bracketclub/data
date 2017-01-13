'use strict';

require('dotenv').config();

const _ = require('lodash');
const data = require('bracket-data');
const Updater = require('bracket-updater');

const {INTERVAL} = require('./interval');
const createLogger = require('../lib/logger');
const createSaveMaster = require('../lib/saveMaster');
const {sport, year, id} = require('../lib/sportYear');

let currentMaster;
const logger = createLogger(`scores:${id}`);
const saveMaster = createSaveMaster({logger, sport, year});
const setMaster = (bracket) => {
  currentMaster = bracket;
  saveMaster(bracket, _.noop);
};

const {
  BEST_OF_RANGE: bestOf,
  EMPTY: empty,
  UNPICKED_MATCH: unpickedChar
} = data({sport, year}).constants;
const updater = new Updater({sport, year});

logger.log(`Starting scores:${id}`);

setMaster(empty);

const interval = setInterval(() => {
  const next = updater.next({currentMaster}, {winner: true, order: false});

  setMaster(updater.update({
    currentMaster,
    fromRegion: next[0].fromRegion,
    winner: {seed: next[0].seed, name: next[0].name},
    loser: {seed: next[1].seed, name: next[1].name},
    playedCompetitions: bestOf && _.sample(bestOf)
  }));

  if (currentMaster.indexOf(unpickedChar) === -1) {
    clearInterval(interval);
  }
}, INTERVAL);
