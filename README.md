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
# They will also use the current year for $YEAR

# Start all (probably dont do this)
./pm2

# Start only one
./pm2 $WATCHER $SPORT

# Run other pm2 commnads
./pm2 $WATCHER $SPORT restart
./pm2 $WATCHER $SPORT stop
./pm2 $WATCHER $SPORT delete
./pm2 $WATCHER $SPORT logs
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

## Deploy to Linode

- [Edit StackScript](https://manager.linode.com/stackscripts/edit/72210)
- [Rebuild with StackScript](https://manager.linode.com/linodes/rebuild/bracketclub?StackScriptID=72210)
