'use strict';

const year = new Date().getFullYear();
const WATCHERS = ['entries', 'scores'];
const SPORTS = ['ncaam', 'ncaaw', 'nba', 'nhl'];

const combine = (arr1, arr2) => arr1.reduce((memo, item1) => {
  arr2.forEach((item2) => memo.push([item1, item2]));
  return memo;
}, []);

/* eslint-disable camelcase */
const apps = combine(WATCHERS, SPORTS).map(([watcher, sport]) => ({
  exec_mode: 'fork',
  merge_logs: true,
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
/* eslint-enable camelcase */

module.exports = {apps};
