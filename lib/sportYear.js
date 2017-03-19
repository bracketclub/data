'use strict';

const {argv} = require('yargs')
  .env('BC') // Uses BC_SPORT and BC_YEAR as fallbacks
  .string('year')
  .default('year')
  .string('sport');

if (Array.isArray(argv.year)) {
  argv.year = argv.year[argv.year.length - 1];
}

const {sport, year} = argv;

module.exports = {
  sport,
  year,
  id: `${sport}-${year}`
};
