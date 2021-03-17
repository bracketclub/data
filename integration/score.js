'use strict';

require('dotenv').config();

const _ = require('lodash');
const data = require('bracket-data');
const Updater = require('bracket-updater');

const createLogger = require('../lib/logger');
const createSaveMaster = require('../lib/saveMaster');
const {sport, year, id} = require('../lib/sportYear');
const initialBracket = require('../lib/initialBracket');

const {
  BEST_OF_RANGE: bestOf,
  UNPICKED_MATCH: unpickedChar
} = data({sport, year}).constants;

const updater = new Updater({sport, year});
const logger = createLogger(`score-${id}`);
const saveMaster = createSaveMaster({logger, sport, year});

initialBracket({logger, sport, year}, (err, currentMaster) => {
  if (err) {
    logger.error(`Error starting score watcher: ${err}`);
    return;
  }

  if (currentMaster.indexOf(unpickedChar) === -1) {
    logger.error('No more scores to enter');
    return;
  }

  const next = updater.next({currentMaster}, {winner: true, order: false});

  saveMaster(updater.update({
    currentMaster,
    fromRegion: next[0].fromRegion,
    winner: {seed: next[0].seed, name: next[0].name},
    loser: {seed: next[1].seed, name: next[1].name},
    playedCompetitions: bestOf && _.sample(bestOf)
  }), () => {
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  });
});

