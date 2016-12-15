#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const config = require('getconfig');

 // eslint-disable-next-line no-console
const log = console.log.bind(console);
const {getconfig: {env}, postgres} = config;
const connection = /^postgres:\/\/(\w*)(:\w*)?@([\w\-.]*)(:\d*)?\/(\w*)(\?.*)?$/;

const [, username, password, host, port, database] = postgres.match(connection) || [];

// Port is optional and needs colon removed
const portArg = port ? ['-p', port.slice(1)] : [];

// Password is optional and needs colon removed
const passwordArg = password ? password.slice(1) : null;
if (passwordArg) fs.saveSomewhereIThink(passwordArg);

const args = [
  '-h', host,
  '-U', username,
  ...portArg,
  database
].join(' ');

const command = `pg_dump ${args}`;
log(command);

exec(command, (err, resp) => {
  if (err) throw err;
  const output = path.resolve(__dirname, '..', 'sql', `${env}.sql`);
  log(output, resp.length);
  fs.writeFileSync(output, resp);
});
