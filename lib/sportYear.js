'use strict';

const {
  sport,
  year
} = require('yargs')
  .env('TYB') // Uses TYB_SPORT and TYB_YEAR as fallbacks
  .string('year')
  .default('year', new Date().getFullYear())
  .string('sport')
  .argv;

module.exports = {
  sport,
  year,
  id: `${sport}-${year}`
};
