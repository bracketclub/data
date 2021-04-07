/* eslint-disable camelcase */
/* eslint-env mocha */

"use strict";

const assert = require("assert");
const bd = require("bracket-data");
const BracketGenerator = require("bracket-generator");

const APP_NAME = "lukekarrys.com";
const APP_HASHTAGS = ["sometaggg"];
const _cloneDeep = function (obj) {
  return JSON.parse(JSON.stringify(obj));
};
const year = "2013";
const sport = "ncaam";
const BracketFinder = require("../index");

const bf = new BracketFinder({
  domain: APP_NAME,
  tags: APP_HASHTAGS,
  year,
  sport,
});

const emptyBracket = bd({
  year,
  sport,
}).constants.EMPTY;

const generatedBracket = new BracketGenerator({
  year,
  sport,
  winners: "lower",
});
const bracket = generatedBracket.generate();

const fullTweet = {
  text: `There is no important${bracket}text in this tweet`,
  entities: {
    urls: [
      {
        expanded_url: `http://lukecod.es/#${bracket}`,
      },
      {
        expanded_url: "http://is.gd/WpcYwJ", // espn.com
      },
    ],
    hashtags: [
      {
        text: APP_HASHTAGS[0],
      },
    ],
  },
};
const goodUrl = { expanded_url: `http://${APP_NAME}/#${bracket}` };
const goodText = `Some text of ${bracket} the tweet`;
const goodHashtag = { text: bracket };

// http://lukekarrys.com/#MW185463721432121W185463721432121S185463721432121E185463721432121FFMWSMW
const shortenedUrl = "http://bit.ly/19ZYSVj";

describe("Bracket Finder", () => {
  it("should return a valid bracket from the url", (done) => {
    const testTweet = _cloneDeep(fullTweet);
    testTweet.entities.urls.push(goodUrl);
    bf.tweet(testTweet, (err, res) => {
      assert.equal(err, undefined);
      assert.equal(bracket, res);
      done();
    });
  });

  it("should return a valid bracket from the text", (done) => {
    const testTweet = _cloneDeep(fullTweet);
    testTweet.text = goodText;
    bf.tweet(testTweet, (err, res) => {
      assert.equal(err, undefined);
      assert.equal(bracket, res);
      done();
    });
  });

  it("should return a valid bracket from the hashtags", (done) => {
    const testTweet = _cloneDeep(fullTweet);
    testTweet.entities.hashtags.push(goodHashtag);
    bf.tweet(testTweet, (err, res) => {
      assert.equal(err, undefined);
      assert.equal(bracket, res);
      done();
    });
  });

  it("should not return a bracket from a tweet that does not match tags", (done) => {
    bf.tweet(
      { text: "Test", entities: { urls: [], hashtags: [] } },
      (err, res) => {
        assert.equal(null, res);
        assert.equal(true, err instanceof Error);
        assert.equal(err.message, "Data does not match tags");
        done();
      }
    );
  });

  it("should not return a bracket from a tweet that does not match domain", (done) => {
    const bracketFinder = new BracketFinder({
      domain: APP_NAME,
      tags: APP_HASHTAGS,
      year,
      sport,
      forceMatch: ["domain"],
    });

    bracketFinder.tweet(
      { text: "Test", entities: { urls: [], hashtags: [] } },
      (err, res) => {
        assert.equal(null, res);
        assert.equal(true, err instanceof Error);
        assert.equal(err.message, "Data does not match domain");
        done();
      }
    );
  });

  it("should not return a bracket from a tweet that does not match domain and tags when a tag is set", (done) => {
    const bracketFinder = new BracketFinder({
      domain: APP_NAME,
      tags: APP_HASHTAGS,
      year,
      sport,
      forceMatch: ["domain", "tags"],
    });

    bracketFinder.tweet(
      {
        text: "Test",
        entities: { urls: [], hashtags: [{ text: "sometaggg" }] },
      },
      (err, res) => {
        assert.equal(null, res);
        assert.equal(true, err instanceof Error);
        assert.equal(err.message, "Data does not match domain");
        done();
      }
    );
  });

  it("should not return a bracket from a tweet that does not match domain and tags when a domain is set", (done) => {
    const bracketFinder = new BracketFinder({
      domain: APP_NAME,
      tags: APP_HASHTAGS,
      year,
      sport,
      forceMatch: ["domain", "tags"],
    });

    bracketFinder.tweet(
      { text: "Test", entities: { urls: [goodUrl], hashtags: [] } },
      (err, res) => {
        assert.equal(null, res);
        assert.equal(true, err instanceof Error);
        assert.equal(err.message, "Data does not match tags");
        done();
      }
    );
  });

  it("should not force domain or tags when option is an empty array", (done) => {
    const bracketFinder = new BracketFinder({
      domain: APP_NAME,
      tags: APP_HASHTAGS,
      year,
      sport,
      forceMatch: null,
    });

    bracketFinder.tweet(
      { text: "Test", entities: { urls: [], hashtags: [] } },
      (err, res) => {
        assert.equal(null, res);
        assert.equal(true, err instanceof Error);
        assert.equal(err.message, "No bracket in tweet");
        done();
      }
    );
  });

  it("should not return a bracket from a bad tweet", (done) => {
    bf.tweet(
      {
        text: "Test",
        entities: { urls: [], hashtags: [{ text: "sometaggg" }] },
      },
      (err, res) => {
        assert.equal(null, res);
        assert.equal(true, err instanceof Error);
        assert.equal(err.message, "No bracket in tweet");
        done();
      }
    );
  });

  it("should not a validate bracket if bracket is incomplete", (done) => {
    bf.tweet(
      {
        text: emptyBracket,
        entities: { urls: [], hashtags: [{ text: "sometaggg" }] },
      },
      (err, res) => {
        assert.equal(null, res);
        assert.equal(true, err instanceof Error);
        assert.equal(err.message, "Bracket has unpicked matches");
        done();
      }
    );
  });

  it.skip("should return a valid bracket from a shortened url (unless in a browser)", (done) => {
    const bff = new BracketFinder({
      domain: APP_NAME,
      tags: APP_HASHTAGS,
      year,
      sport,
    });
    const testTweet = _cloneDeep(fullTweet);
    testTweet.entities.urls.push({ expanded_url: shortenedUrl });
    bff.tweet(testTweet, (err, res) => {
      if (typeof window === "undefined") {
        assert.equal(null, err);
        assert.equal(bracket, res);
        done();
      } else {
        assert.equal(null, res);
        assert.equal(true, err instanceof Error);
        assert.equal(err.message, "No bracket in tweet");
        done();
      }
    });
  });

  it("should not return a bracket from a bad tweet", (done) => {
    const testTweet = _cloneDeep(fullTweet);
    bf.tweet(testTweet, (err, res) => {
      assert.equal(null, res);
      assert.equal(true, err instanceof Error);
      assert.equal(err.message, "No bracket in tweet");
      done();
    });
  });
});
