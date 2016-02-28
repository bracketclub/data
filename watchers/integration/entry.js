'use strict';

const Generator = require('bracket-generator');
const argv = require('yargs').string('year').argv;

const saveEntry = require('../entry');

const INITIAL = 5000;
const INTERVAL = 5000;
const bracket = new Generator({
  year: argv.year || process.env.TYB_YEAR,
  sport: argv.sport || process.env.TYB_SPORT
});

const A = 65;
const numbers = () => Math.random().toString().slice(2);
const letters = () => numbers().split('').map((n) => String.fromCharCode(parseInt(n, 10) + A)).join('');

setTimeout(() => setInterval(() => saveEntry({
  data_id: numbers(),
  user_id: numbers(),
  username: letters(),
  name: letters(),
  profile_pic: '',
  bracket: bracket.generate('random'),
  created: new Date().toJSON()
}), INTERVAL), INITIAL);