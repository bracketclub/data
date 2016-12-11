'use strict';

const pgConnect = require('./pgConnect');

module.exports = ({logger, sport}) => (master, cb) => pgConnect(logger, (client, done) => client.query(
  `INSERT INTO masters
  (bracket, created, sport)
  VALUES ($1, $2, $3);`,
  [master, new Date().toJSON(), sport],
  (err) => {
    client.query(`NOTIFY masters, '${sport}-${new Date().getFullYear()}';`);

    done();

    if (err) {
      logger.error(`masters error: ${err}`);
      return cb(err);
    }

    logger.debug(`masters success: ${master}`);
    return cb(null, master);
  }
));
