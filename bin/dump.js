#!/usr/bin/env node

"use strict";

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const config = require("getconfig");

// eslint-disable-next-line no-console
const log = console.log.bind(console);
const {
  getconfig: { env },
  postgres,
} = config;

let nodeEnv = env;
if (nodeEnv.startsWith("dev")) nodeEnv = "development";

const connection = /^postgres:\/\/(\w*)(:\w*)?@([\w\-.]*)(:\d*)?\/([\w-]*)(\?.*)?$/;
const [, username, password, host, port, database] =
  postgres.match(connection) || [];

const args = [
  "-h",
  host,
  "-U",
  username,
  ...(port ? ["-p", port.slice(1)] : []),
  database,
].join(" ");

const command = `pg_dump ${args}`;
log(command);

// Password is optional and needs colon removed
const passwordArg = password ? password.slice(1) : null;
if (passwordArg) {
  process.env.PGPASSWORD = passwordArg;
  log("Password:", "*".repeat(passwordArg.length));
}

exec(command, (err, resp) => {
  if (err) throw err;

  const write = (e, data) => {
    const f = path.resolve(__dirname, "..", "sql", `${e}.sql`);
    log(f, data.length);
    fs.writeFileSync(f, data);
  };

  write(nodeEnv, resp);
  if (nodeEnv === "production") {
    write(
      "development",
      resp.replace(new RegExp(username, "g"), "bracketclub")
    );
  }
});
