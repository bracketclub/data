#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs');
const async = require('async');
const _ = require('lodash');
const request = require('request');
const mkdirp = require('mkdirp');
const yargs = require('yargs');
const pg = require('pg');

const {
  url: URL,
  dir: DIR,
  dry: DRY,
  db: DB
} = yargs
  .string('url')
  .string('dir')
  .string('db')
  .boolean('dry')
  .argv;

// eslint-disable-next-line no-console
const logger = console;

const getQueryRows = (query) => (cb) => pg.connect(DB, (connErr, client, done) => {
  if (connErr) {
    return cb(connErr);
  }

  return client.query(query, (err, res) => {
    done();

    if (err) return cb(err);
    if (!res || !res.rows.length) return cb(new Error('Not found'));

    return cb(null, _.map(res.rows, 'id'));
  });
});

const getUrls = (cb) => async.parallel({
  users: getQueryRows(
    `SELECT
      u.id
    FROM
      users as u`
  ),
  events: getQueryRows(
    `SELECT
      (sport || '-' || extract(YEAR from created)) as id
    FROM
      masters
    GROUP BY
      extract(YEAR from created), sport`
  )
}, (err, res) => {
  if (err) return cb(err);

  const events = res.events;
  const users = res.users;
  const urls = [];

  events.forEach((e) => {
    urls.push(
      `/masters/${e}`,
      `/entries/${e}`
    );
  });

  users.forEach((u) => {
    urls.push(`/users/${u}`);
    events.forEach((e) => {
      urls.push(`/users/${u}/${e}`);
    });
  });

  return cb(null, urls);
});

const saveJSONToFile = (url, cb) => request(`${URL}${url}`, (err, resp, body) => {
  if (err) {
    return cb(err);
  }

  const dirname = path.dirname(url);
  const basename = path.basename(url);
  const dir = path.resolve(process.cwd(), DIR, dirname);
  const file = path.join(dir, `${basename}.json`);
  const data = JSON.parse(body);

  if (DRY) {
    logger.log(`Writing ${file}`);
    logger.log(JSON.stringify(data));
    return cb();
  }

  mkdirp.sync(dir);
  fs.writeFileSync(file, JSON.stringify(data));
  return cb();
});

getUrls((err, urls) => {
  if (err) {
    logger.error('get urls error', err);
    throw err;
  }

  return async.series(
    urls.map((url) => (cb) => saveJSONToFile(url, cb)),
    (taskErr) => {
      if (taskErr) {
        logger.error('save json err', taskErr);
        throw taskErr;
      }

      logger.log('Success!');

       // eslint-disable-next-line no-process-exit
      process.exit(0);
    }
  );
});
