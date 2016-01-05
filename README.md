<p align="center">
    <a href="https://openstax.org">
        <img height="51" width="251" src="https://raw.githubusercontent.com/openstax/os-webview/master/src/images/logo.png">
    </a>
</p>

# OpenStax

[![Build Status](https://travis-ci.org/openstax/os-webview.svg?branch=master)](https://travis-ci.org/openstax/os-webview)
[![dependency Status](https://david-dm.org/openstax/os-webview.svg)](https://david-dm.org/openstax/os-webview#info=dependencies)
[![devDependency Status](https://david-dm.org/openstax/os-webview/dev-status.svg)](https://david-dm.org/openstax/os-webview#info=devDependencies)

## Requirements

* Node.js v5.3+
* Ruby v1.9.3+
* Gulp v4.0.0-alpha.2+
* JSPM v0.16.19+

## Installation

All Mac installation instructions assume you already have [Homebrew](http://brew.sh) installed.

### Install Node.js

#### Mac OS X

```bash
brew install node
```

#### Debian / Ubuntu

```bash
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential
sudo ln -s /usr/bin/nodejs /usr/bin/node
```

### Install Ruby

#### Mac OS X

Newer versions of OS X use System Integrity Protection, which prevents modification of certain System directories, even as root.  This also prevents installation of Gems to the System copy of Ruby; therefore, you will need to install a separate copy of Ruby for development.

```bash
brew install rbenv ruby-build

# Add rbenv to bash so that it loads every time you open a terminal
echo 'if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi' >> ~/.bash_profile
source ~/.bash_profile

# Install Ruby
rbenv install 2.2.3
rbenv global 2.2.3
ruby -v
```

#### Debian / Ubuntu

```bash
# Install Ruby Dependencies
sudo apt-get install git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev python-software-properties libffi-dev

# Install Ruby
cd
git clone git://github.com/sstephenson/rbenv.git .rbenv
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
exec $SHELL

git clone git://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
echo 'export PATH="$HOME/.rbenv/plugins/ruby-build/bin:$PATH"' >> ~/.bashrc
exec $SHELL

git clone https://github.com/sstephenson/rbenv-gem-rehash.git ~/.rbenv/plugins/rbenv-gem-rehash

rbenv install 2.2.3
rbenv global 2.2.3
ruby -v

# Tell Rubygems to not install documentation for each package locally, then install Bundler
echo "gem: --no-ri --no-rdoc" > ~/.gemrc
gem install bundler
```

### Install SCSS Lint

```bash
gem install scss_lint
```

### Install Gulp

```bash
npm install -g gulpjs/gulp-cli#4.0
```

Note: On OS X, you must have Xcode 7.1+ installed along with the associated Command Line Tools (Xcode will prompt you to install these when you launch it if they are not installed).

### Install JSPM

```bash
npm install -g jspm
```

Note: If you have not previously used JSPM, you may be prompted to set up your GitHub credentials.  It is recommended you do this in order to prevent being rate limited by GitHub.  You can [generate an access token](https://github.com/settings/tokens) in your GitHub account settings for JSPM, rather than providng your login credentials.

If you are not prompted, you can manually bring it up with `jspm registry config github`.

### Install OpenStax CNX Webview

```bash
git clone git@github.com:openstax/os-webview.git
cd os-webview
npm install
```

## Development

To build the site for development and load it in your default web browser with [BrowserSync](http://www.browsersync.io), simply run:

```bash
gulp dev
```

That will create a new `dev` directory from which the site is served.  Changes should be made to files in the `src` directory.  Gulp will automatically watch for changes in `src`, perform any compilation and transpilation necessary, and update the result in `dev`.

You can also run individual tasks.  Enter `gulp --tasks` to see the full list.

## Build for Production

```bash
gulp
```

You must configure your web server to host the files in the `dist` directory that gets created.  No special configuration is required, although it is highly recommended to serve the site using SPDY or HTTP/2.

## Configuration

The `settings.js` file can be used to modify a number of site-wide configurations.
