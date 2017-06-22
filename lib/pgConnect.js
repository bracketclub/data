'use strict';

const pg = require('pg');
const postgresConfig = require('./pgConfig');

const pool = new pg.Pool({connectionString: postgresConfig});

module.exports = (logger, cb) => pool.connect((err, client, done) => {
  if (err) {
    done();
    logger.error(`DB connect error ${err}`);
    return;
  }
  cb(client, done);
});
