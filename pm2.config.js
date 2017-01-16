'use strict';

const {year} = require('../lib/sportYear');

const WATCHERS = ['entries', 'scores'];
const SPORTS = ['ncaam', 'ncaaw', 'nba', 'nhl'];

const combine = (arr1, arr2) => arr1.reduce((memo, item1) => {
  arr2.forEach((item2) => memo.push([item1, item2]));
  return memo;
}, []);

const apps = combine(WATCHERS, SPORTS).map(([watcher, sport]) => ({
  /* eslint-disable camelcase */
  exec_mode: 'fork',
  merge_logs: true,
  /* eslint-enable camelcase */
  instances: 1,
  script: `./watchers/${watcher}.js`,
  name: `${watcher}-${sport}`,
  env: {
    TYB_YEAR: year,
    TYB_SPORT: sport,
    NODE_ENV: 'development'
  },
  env_production: {
    NODE_ENV: 'production'
  }
}));

module.exports = {apps};
