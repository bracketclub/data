var _ = require('lodash');
var async = require('async');
var path = require('path');
var fs = require('fs');

var outDir = path.resolve(__dirname, '..', 'data');
var models = require('../models');


var stream = require('stream');
var util = require('util');

function EchoStream () {
    stream.Writable.call(this);
}

util.inherits(EchoStream, stream.Writable);

EchoStream.prototype._write = function (chunk, encoding, done) {
    this.__data || (this.__data = '');
    this.__data += chunk.toString();
    done();
};


async.parallel([
    function (cb) {
        var s = new EchoStream();
        s.on('finish', function () {
            var entries = _.chain(JSON.parse(this.__data))
            .sortBy('ms')
            .map(function (entry) {
                return _.omit(entry, 'bucket');
            })
            .value();

            fs.writeFile(outDir + '/entry.json', JSON.stringify(entries, null, 2), cb);
        });
        s.on('error', cb);
        models.Entry.exportJSON(s);
    },
    function (cb) {
        var s = new EchoStream();
        s.on('finish', function () {
            var masters =  _.chain(JSON.parse(this.__data))
            .sortBy('year')
            .map(function (entry) {
                return _.omit(entry, 'bucket');
            })
            .value();
            fs.writeFile(outDir + '/master.json', JSON.stringify(masters, null, 2), cb);
        });
        s.on('error', cb);
        models.Master.exportJSON(s);
    }
], function (err, results) {
    console.log(err, results);
});