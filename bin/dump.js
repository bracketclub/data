#!/usr/bin/env node

'use strict';

require('dotenv').config();

// Get around production env vars that might not be set
process.env.TWITTER_KEY = 'null';
process.env.TWITTER_SECRET = 'null';
process.env.TWITTER_TOKEN = 'null';
process.env.TWITTER_TOKEN_SECRET = 'null';

const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const config = require('getconfig');

const NODE_ENV = process.env.NODE_ENV;

 // eslint-disable-next-line no-console
const log = console.log.bind(console);
const {getconfig: {env}, postgres} = config;

const connection = /^postgres:\/\/(\w*)(:\w*)?@([\w\-.]*)(:\d*)?\/([\w-]*)(\?.*)?$/;
const [, username, password, host, port, database] = postgres.match(connection) || [];

const args = [
  '-h', host,
  '-U', username,
  ...(port ? ['-p', port.slice(1)] : []),
  database
].join(' ');

const command = `pg_dump ${args}`;
log(command);

// Password is optional and needs colon removed
const passwordArg = password ? password.slice(1) : null;
if (passwordArg) {
  process.env.PGPASSWORD = passwordArg;
  log('Password:', '*'.repeat(passwordArg.length));
}

exec(command, (err, resp) => {
  if (err) throw err;

  const write = (e, data) => {
    const f = path.resolve(__dirname, '..', 'sql', `${e}.sql`);
    log(f, data.length);
    fs.writeFileSync(f, data);
  };

  write(env, resp);
  if (NODE_ENV === 'production') {
    write('development', resp.replace(new RegExp(username, 'g'), 'bracketclub'));
  }
});
