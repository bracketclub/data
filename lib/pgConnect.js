'use strict';

const pg = require('pg');
const postgresConfig = require('./pgConfig');

module.exports = (logger, cb) => pg.connect(postgresConfig, (err, client, done) => {
  if (err) {
    done();
    logger.error(`DB connect error ${err}`);
    return;
  }
  cb(client, done);
});
