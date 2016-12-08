tweetyourbracket-api OPS
=================

## Digital Ocean Setup on Ubuntu 14.04

**[Initial server setup](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-14-04)**

Most of this is culled from this [tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-14-04). Also getting [automatic security updates](https://help.ubuntu.com/community/AutomaticSecurityUpdates)..

The first tutorial has been modified so it only needs one droplet. This used to run the database and API but those have been moved to a hosted places for the DB (Heroku)
and API [Now.sh].

### DO Droplet

```sh
# Turn on auto security updates
sudo dpkg-reconfigure --priority=low unattended-upgrades

# Install node
cd ~
wget https://nodejs.org/dist/v5.4.0/node-v5.4.0-linux-x64.tar.gz

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

# Install api
sudo su - tweetyourbracket
git clone git@bitbucket.org:tweetyourbracket/db.git
cd api/
npm install

# Create config
cp config/default.json config/production.json
nano config/production.json
# Add values for twitter auth, postgres connection

# Setup pm2
sudo su - tweetyourbracket
sudo npm install -g pm2
pm2 statup ubuntu # only the first time

# npm run-scripts to start things using pm2
npm run pm2:start -- --only entries:ncaam
npm run pm2:start -- --only entries:ncaaw
npm run pm2:start -- --only scores:ncaam
npm run pm2:start -- --only scores:ncaaw

# Later
npm run pm2:restart -- --only entries:ncaam # or (entries|scores):ncaa(m|w)
npm run pm2:stop -- --only entries:ncaam
npm run pm2:delete -- --only entries:ncaam
npm run pm2:logs -- --only entries:ncaam
```
