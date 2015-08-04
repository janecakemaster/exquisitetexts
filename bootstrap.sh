sudo add-apt-repository ppa:git-core/ppa
sudo apt-get update
sudo apt-get install -y build-essential openssl libssl-dev pkg-config git nginx zsh
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | bash

source ~/.profile
nvm ls-remote
nvm install 0.12.7

npm install -g forever


sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

# git clone git@github.com:janecakemaster/exquisitetexts.git exquisite
# cd exquisite && npm install
# forever start server.js
# sudo vi /etc/nginx/sites-available/default
# see https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-14-04
# sudo service nginx restart
