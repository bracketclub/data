'use strict';

const {
  sport,
  year
} = require('yargs')
  .env('BC') // Uses BC_SPORT and BC_YEAR as fallbacks
  .string('year')
  .default('year')
  .string('sport')
  .argv;

module.exports = {
  sport,
  year,
  id: `${sport}-${year}`
};
