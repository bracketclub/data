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

```sh
node watchers/$WATCHER --sport=$SPORT --year=$YEAR
```


## Via pm2

```sh
# Any command run through this npm run-script will use NODE_ENV=production

# Start all (probably dont do this)
npm run pm2:start

# Operate on only one
npm run pm2:start -- --only $WATCHER-$SPORT
npm run pm2:restart -- --only $WATCHER-$SPORT
npm run pm2:stop -- --only $WATCHER-$SPORT
npm run pm2:delete -- --only $WATCHER-$SPORT
npm run pm2:logs -- --only $WATCHER-$SPORT
```


## Integration Tests

```sh
# Connects to the DB and adds masters/entries/users to all sports every 5 seconds
npm run integration
# You can pass other arguments to all integration runners
npm run integration -- --year 2016
```


## So you missed a finished score in production

```sh
# Want you probably want to do if you missed something today.
# Since order of masters matters in the database the --teams param order
# is important. This will take the current bracket and look up the scores for today
# (or use --date) and apply each result that the teams played in.
NODE_ENV=production npm run insert-by-team -- --sport ncaaw --teams uconn "notre dame"
```

## Dumping a database

```sh
# Connection string will come from NODE_ENV and it will save to sql/$ENV.sql
NODE_ENV=production npm run dump
```

## Setting up environment variables

```sh
# Create a .env file with all the necessary env vars for production
echo "TWTR_KEY=\nTWTR_SECRET=\nTWTR_TOKEN=\nTWTR_TOKEN_SECRET=\nPOSTGRES_URL=\n" > .env
```

## Deploying on Digital Ocean

- [Initial server setup](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-14-04)
- [Setting up a Node app](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-14-04)
- [Security](https://help.ubuntu.com/community/AutomaticSecurityUpdates)
