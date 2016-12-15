'use strict';

const pg = require('pg');
const config = require('getconfig');

module.exports = (logger, cb) => pg.connect(config.postgres, (err, client, done) => {
  if (err) {
    done();
    logger.error(`DB connect error ${err}`);
    return;
  }
  cb(client, done);
});
