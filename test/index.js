/* eslint no-console:0 */

'use strict';

const path = require('path');
const spawn = require('child_process').spawn;
const test = require('tape');
const ms = require('ms');

const start = (...args) => spawn(path.join(__dirname, '..', 'bin', 'integration.sh'), args);
const logData = (data) => data.toString().trim().replace(/^\s+|\s+$/g, '');
const time = ms('5s');

test('test', {timeout: time + ms('1s')}, (t) => {
  const integration = start('--year', '2016', '--interval', '200');
  const output = [];
  const errors = [];

  integration.stdout.on('data', (data) => {
    const log = logData(data);
    if (/^\d\d:\d\d:\d\d/.test(log)) {
      output.push(log);
    }
  });

  integration.stderr.on('data', (data) => {
    const log = logData(data);
    errors.push(log);
    integration.kill();
  });

  integration.on('exit', (code, signal) => {
    console.log(output.length);
    t.ok(output.length);

    console.log(JSON.stringify(errors, null, 2));
    t.notOk(errors.length);
    t.end();
  });

  setTimeout(() => integration.kill(), time);
});
