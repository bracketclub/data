'use strict';

const argv = require('yargs').string('year').argv;

const sport = argv.sport || process.env.TYB_SPORT;
const year = argv.year || process.env.TYB_YEAR || '2016';

if (!sport && !year) {
  throw new Error('TYB_SPORT and TYB_YEAR env variables are required');
}

module.exports = {
  sport,
  year,
  id: `${sport}-${year}`
};
