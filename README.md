tweetyourbracket-api
=================

The data and DB for Tweet Your Bracket.


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
node watchers/$WATCHER --sport=$SPORT --year $YEAR
```


## Via pm2

```sh
# npm run-scripts to start things using pm2
npm run pm2:start -- --only $WATCHER:$SPORT

# Later
npm run pm2:restart -- --only $WATCHER:$SPORT
npm run pm2:stop -- --only $WATCHER:$SPORT
npm run pm2:delete -- --only $WATCHER:$SPORT
npm run pm2:logs -- --only $WATCHER:$SPORT
```


## Integration Tests

```sh
# Connects to the DB and adds masters/entries/users to all sports
# every 5 seconds
npm run integration
```


## Deploying on Digital Ocean

- [Initial server setup](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-14-04)
- [Setting up a Node app](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-14-04)
- [Security](https://help.ubuntu.com/community/AutomaticSecurityUpdates)

```sh
# Turn on auto security updates
sudo dpkg-reconfigure --priority=low unattended-upgrades

# Install node
cd ~
wget https://nodejs.org/dist/v6.9.1/node-v6.9.1-linux-x64.tar.gz

mkdir node
tar xvf node-v*.tar.gz --strip-components=1 -C ./node

cd ~
rm -rf node-v*

mkdir node/etc
echo 'prefix=/usr/local' > node/etc/npmrc

sudo mv node /opt/
sudo chown -R root: /opt/node

sudo ln -s /opt/node/bin/node /usr/local/bin/node
sudo ln -s /opt/node/bin/npm /usr/local/bin/npm

# Create user account
sudo useradd -d /home/tweetyourbracket -m tweetyourbracket
sudo adduser tweetyourbracket sudo
sudo passwd tweetyourbracket

# Install data
sudo su - tweetyourbracket
git clone git@bitbucket.org:tweetyourbracket/data.git
cd data/
npm install

# Create config
nano config/production.json
# Add values for twitter auth, postgres connection

# Setup pm2
sudo su - tweetyourbracket
sudo npm install -g pm2
pm2 statup ubuntu # only the first time

# See above for running via pm2
```

