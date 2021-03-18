#!/usr/bin/env node

"use strict";

const env = require("fs")
  .readFileSync("./.env")
  .toString()
  .split("\n")
  .filter(Boolean);

const envObj = env
  .map((l) => l.split("="))
  // eslint-disable-next-line no-sequences, no-return-assign
  .reduce((a, i) => ((a[i[0]] = i[1]), a), {});

process.stdout.write(JSON.stringify(envObj));
