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
  log_file: `logs/pm2/${watcher}-${sport}.log`,
  out_file: `logs/pm2/${watcher}-${sport}-out.log`,
  error_file: `logs/pm2/${watcher}-${sport}-error.log`,
  script: `./watchers/${watcher}.js`,
  name: `${watcher}-${sport}`,
  min_uptime: '5s',
  max_restarts: 5,
  env: {
    BC_YEAR: year,
    BC_SPORT: sport,
    NODE_ENV: 'development'
  },
  env_production: {
    PM2_ENV: true,
    NODE_ENV: 'production'
  }
}));
/* eslint-enable camelcase */

module.exports = {apps};
