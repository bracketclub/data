"use strict";

const path = require("path");
const { spawn } = require("child_process");
const test = require("tape");
const ms = require("ms");

const start = (...args) =>
  spawn(path.join(__dirname, "..", "bin", "integration.sh"), args);
const logData = (data) =>
  data
    .toString()
    .trim()
    .replace(/^\s+|\s+$/g, "");

// eslint-disable-next-line no-console
const logArr = (arr) => arr.forEach((i) => console.log(i));

const time = ms("5s");

test("test", { timeout: time + ms("1s") }, (t) => {
  const integration = start("--year", "2016", "--interval", "200");
  const output = [];
  const errors = [];

  integration.stdout.on("data", (data) => {
    output.push(logData(data));
  });

  integration.stderr.on("data", (data) => {
    errors.push(logData(data));
    integration.kill();
  });

  integration.on("exit", (code, signal) => {
    logArr(output);
    t.ok(output.length);

    logArr(errors);
    t.notOk(errors.length);

    t.end();
  });

  setTimeout(() => integration.kill(), time);
});
