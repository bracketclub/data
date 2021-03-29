"use strict";

const parseUrl = require("url").parse;
const async = require("async");
const realurl = require("simple-realurl");
const BracketValidator = require("bracket-validator");
const bracketData = require("bracket-data");
const _map = require("lodash/map");
const _find = require("lodash/find");
const _defaults = require("lodash/defaults");
const _filter = require("lodash/filter");
const _without = require("lodash/without");
const _bind = require("lodash/bind");
const _compact = require("lodash/compact");
const _intersection = require("lodash/intersection");
const _includes = require("lodash/includes");
const _partial = require("lodash/partial");

class Finder {
  constructor(options) {
    _defaults(options, {
      domain: "",
      tags: [],
      forceMatch: ["tags"],
      // By default dont follow cross domain links if we are in a browser
      followCrossDomain: typeof window === "undefined",
    });

    this.domain = options.domain;
    this.tags = options.tags;
    this.forceMatch = options.forceMatch || [];
    this.followCrossDomain = options.followCrossDomain;

    // Create regexes and validator for later use
    const bracketRegex = bracketData({
      sport: options.sport,
      year: options.year,
    }).regex;

    const fullBracketRegex = new RegExp(`^${bracketRegex.source}$`);

    const validator = new BracketValidator({
      sport: options.sport,
      year: options.year,
      testOnly: true,
      allowEmpty: false,
    });

    // Create helper functions
    this.validate = (bracket, cb) => {
      const validated = validator.validate(bracket);
      cb(
        validated instanceof Error ? validated : null,
        validated instanceof Error ? null : validated
      );
    };

    this.findBracket = (from) =>
      _find(from, (item) => fullBracketRegex.test(item));

    this.domainUrls = _partial(
      (domain, url) => url.toLowerCase().indexOf(domain.toLowerCase()) > -1,
      this.domain
    );

    this.bracketUrls = (url) => {
      const matches = url.match(bracketRegex);
      return matches && matches.length > 0 ? matches[0] : matches;
    };

    this.canGetUrl = _partial((followCrossDomain, url) => {
      if (typeof window === "undefined") {
        return true;
      }
      const parsedUrl = parseUrl(url);
      const { location } = window;
      return (
        (location.protocol === parsedUrl.protocol &&
          location.host === parsedUrl.host) ||
        followCrossDomain
      );
    }, this.followCrossDomain);
  }
  tweet(tweet, cb) {
    _defaults(tweet, { text: "", entities: {} });
    this.find(
      {
        urls: _map(tweet.entities.urls, "expanded_url"),
        tags: _map(tweet.entities.hashtags, "text"),
        text: tweet.text.split(" "),
      },
      cb
    );
  }

  find(data, cb) {
    const self = this;
    const appUrls = _filter(data.urls, this.domainUrls);

    if (
      _includes(this.forceMatch, "tags") &&
      _intersection(this.tags, data.tags).length === 0
    ) {
      cb(new Error("Data does not match tags"));
      return;
    }

    if (_includes(this.forceMatch, "domain") && appUrls.length === 0) {
      cb(new Error("Data does not match domain"));
      return;
    }

    const urlMatches = _compact(_map(appUrls, this.bracketUrls));
    const dataTags = _without(data.tags, this.tags);
    const textChunks = data.text;

    async.waterfall(
      [
        (_cb) => {
          // Most common scenario will be a url with a hash on it
          // Then test for a valid hashtag
          // Also test for a chunk of text that looks good
          _cb(
            null,
            self.findBracket(urlMatches) ||
              self.findBracket(dataTags) ||
              self.findBracket(textChunks)
          );
        },
        (bracket, _cb) => {
          if (bracket) {
            _cb(null, bracket);
            return;
          }

          // Last, check other urls to see if the are matching urls
          const otherUrls = _filter(
            _without(data.urls, appUrls),
            self.canGetUrl
          );
          async.concat(
            otherUrls,
            _bind(realurl.get, realurl),
            (err, longUrls) => {
              if (err) {
                _cb(err, null);
                return;
              }

              const longAppUrls = _filter(longUrls, self.domainUrls);
              const longUrlMatches = _compact(
                _map(longAppUrls, self.bracketUrls)
              );
              const longBracket = self.findBracket(longUrlMatches);

              _cb(
                longBracket ? null : new Error("No bracket in tweet"),
                longBracket || null
              );
            }
          );
        },
      ],
      (err, res) => {
        if (err) {
          cb(err, null);
          return;
        }
        self.validate(res, cb);
      }
    );
  }
}

module.exports = Finder;
