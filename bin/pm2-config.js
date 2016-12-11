#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const {year} = require('../lib/sportYear');

const CONFIG = path.resolve(__dirname, '..', 'pm2.json');

const WATCHERS = ['entries', 'scores'];
const SPORTS = ['ncaam', 'ncaaw', 'nba', 'nhl'];

const combine = (arr1, arr2) => arr1.reduce((memo, item1) => {
  arr2.forEach((item2) => memo.push([item1, item2]));
  return memo;
}, []);

const apps = combine(WATCHERS, SPORTS).map(([watcher, sport]) => ({
  exec_mode: 'fork_mode', // eslint-disable-line camelcase
  script: `./watchers/${watcher}.js`,
  name: `${watcher}:${sport}`,
  env: {
    TYB_YEAR: year,
    TYB_SPORT: sport,
    NODE_ENV: 'production'
  }
}));

fs.writeFileSync(CONFIG, JSON.stringify({apps}, null, 2));
