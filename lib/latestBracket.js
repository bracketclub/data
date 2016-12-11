'use strict';

const pgConnect = require('./pgConnect');

module.exports = ({logger, sport, year}, cb) => pgConnect(logger, (client, done) => client.query(
  `SELECT bracket FROM masters
  WHERE sport = $1 AND extract(YEAR from created) = $2
  ORDER BY created desc
  LIMIT 1;`,
  [sport, year],
  (err, res) => {
    done();

    if (err) {
      return cb(err);
    }

    if (!res || !res.rows.length) {
      return cb(new Error('No bracket found'));
    }

    return cb(null, res.rows[0].bracket);
  }
));
