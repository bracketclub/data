data
=================

The data and DB for [bracket.club](https://bracket.club).

[![Build Status](https://travis-ci.org/bracketclub/data.svg?branch=master)](https://travis-ci.org/bracketclub/data)

## Running each watcher

**Watchers**

- `entries`
- `scores`

**Sports**

- `ncaam`
- `ncaaw`
- `nba`
- `nhl`
- `wcm`
- `wcw`

```sh
node watchers/$WATCHER --sport=$SPORT --year=$YEAR
```


## Via pm2

```sh
# Any command run through this npm run-script will use check the hostname==localhost
# to see if it should run in PRODUCTION mode. You can also pass NODE_ENV=production to force it
# They will also use the current year for $YEAR

# Start only one
npm start $WATCHER $SPORT

# Run other pm2 commnads
npm start $WATCHER $SPORT restart
npm start $WATCHER $SPORT stop
npm start $WATCHER $SPORT delete
npm start $WATCHER $SPORT logs
```


## Before Starting Scores Watcher

For the score watcher to run properly, each of the teams from `bracket-data` should have a match against wherever the scores are fetched. This can be done inside [`bracket-data`](https://github.com/bracketclub/bracket-data) by cloning that repo and running the `npm run names` command. If there are any names missing, then the `bracket-data` package should be published and pulled into this project before `npm start scores` is run.


## Integration Tests

```sh
# Connects to the DB and adds masters/entries/users to all sports every 5 seconds
npm run integration
```


## So you missed a finished score in production

```sh
# Want you probably want to do if you missed something today.
# Since order of masters matters in the database the --teams param order
# is important. This will take the current bracket and look up the scores for today
# (or use --date) and apply each result that the teams played in.
NODE_ENV=production npm run insert-by-team -- --sport ncaaw --teams uconn "notre dame"
```


## So you missed an entry tweet

```sh
NODE_ENV=production npm run find-entry -- --sport ncaam --year 2018 --tweet TWEET_ID
```


## Dumping a database

```sh
# Connection string will come from NODE_ENV and it will save to sql/$ENV.sql
NODE_ENV=production npm run dump
```

## Setting up environment variables

```sh
# Create a .env file with all the necessary env vars for production
echo "TWITTER_KEY=$TWITTER_KEY" >> .env
echo "TWITTER_SECRET=$TWITTER_SECRET" >> .env
echo "TWITTER_TOKEN=$TWITTER_TOKEN" >> .env
echo "TWITTER_TOKEN_SECRET=$TWITTER_TOKEN_SECRET" >> .env
echo "POSTGRES_URL=$POSTGRES_URL" >> .env
```

## Production Database on Heroku

```sh
# Open a psql shell
npm run heroku:psql

# Import current local sql file to production
npm run heroku:psql < sql/production.sql

# Open webpage to heroku DB
npm run heroku:web
```

## Linode CLI Commands

```sh
# Create or rebuild the linode based on the current stackscript
# Pass it a path to a public key in order to allow SSH access
# The .env file will be used to populate vars to the Linode
npm run deploy build

# Update the stackscript with whats in the repo
npm run deploy stackscript

# IP address of linode
npm run deploy ip

# Delete linode
npm run deploy delete
```

## Rough Steps to Launch Each Year

### For Entries
- Update and publish `bracket-data` with new year and teams
- `npm install bracket-data@latest --save` in web app and this repo
- Update web app config with new year
- Locally: `npm run dump:prod-to-dev`
- Locally: `node watchers/entries --sport=$SPORT --year=$YEAR`
- Start `api` and postgres locally
- Run webapp and make sure everything renders
- Deploy to Linode `npm run deploy build`
- `ssh` into linode and run `cd data; npm start entries ncaam`
- Locally test that logs work: `ssh bc "cat ~/data/logs/pm2/entries-ncaam.log"`
- Run this once and then stop it as it seeds the first master bracket `npm start scores ncaam`

### For Scores
- Go to `bracket data` and check `npm run names` works to ensure that the names in `bracket-data` all match the scoreboard
- Go to `scores` and check that the tests pass, especially the ones getting data directly from urls. If anything breaks, fix and write new tests
- Try running `npm start scores ncaam` locally once the first games start
- `ssh` into linode and run `cd data; npm start scores ncaam`
