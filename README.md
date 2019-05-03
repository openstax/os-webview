<p align="center">
    <a href="https://openstax.org">
        <img height="51" width="251" src="https://cdn.rawgit.com/openstax/os-webview/master/src/images/logo.svg">
    </a>
</p>

# OpenStax

[![Build Status](https://travis-ci.org/openstax/os-webview.svg?branch=master)](https://travis-ci.org/openstax/os-webview)
[![Code Climate](https://codeclimate.com/github/openstax/os-webview/badges/gpa.svg)](https://codeclimate.com/github/openstax/os-webview)
[![dependency Status](https://david-dm.org/openstax/os-webview.svg)](https://david-dm.org/openstax/os-webview#info=dependencies)
[![devDependency Status](https://david-dm.org/openstax/os-webview/dev-status.svg)](https://david-dm.org/openstax/os-webview#info=devDependencies)

## Requirements

* [nvm](https://github.com/creationix/nvm)

## Installation

All Mac installation instructions assume you already have [Homebrew](http://brew.sh) installed.

### Install nvm

```bash
# From https://github.com/creationix/nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh | bash
```

### Install OpenStax Webview

```bash
git clone git@github.com:openstax/os-webview.git
cd os-webview
./script/setup
```

## Build and Run the Development Server

To build the site for development and load it in your default web browser with [BrowserSync](http://www.browsersync.io), simply run:

```bash
./script/server
```

That will create a new `dev` directory from which the site is served.  Changes should be made to files in the `src` directory.  Gulp will automatically watch for changes in `src`, perform any compilation and transpilation necessary, and update the result in `dev`.

You can also run individual tasks.  Enter `$(npm bin)/gulp --tasks` to see the full list.

## Testing

To run the linters and unit tests locally, enter:

```bash
./script/test
```

You can also just run the linters (`$(npm bin)/gulp lint`) individually without rebuilding.

**Note:** The unit tests require the dev build to be built (in the `dev` directory).

## Build for Production

```bash
./script/build
```

You must configure your web server to host the files in the `dist` directory that gets created.  No special configuration is required, although it is highly recommended to serve the site using HTTP/2.

## Configuration

The `settings.js` file can be used to modify a number of site-wide configurations. To edit settings for the development server (for example, to use a local copy of the [CMS](https://github.com/openstax/openstax-cms)), make a copy of `settings-example.js` and rename to `settings.js` at the root level.


## Upgrading Dependencies

You can upgrade dependencies manually or you can upgrade all of them by running `./script/upgrade && ./script/test`.

## Updating Version

The version must be updated in each release to help prevent browser caching issues. The version is updated in 3 locations.

1. [version.js](https://github.com/openstax/os-webview/blob/master/src/app/version.js) Update the constant.
2. [index.html](https://github.com/openstax/os-webview/blob/master/src/index.html) Update the version on reference to main.css and bundle.js
3. [package.json](https://github.com/openstax/os-webview/blob/master/package.json) Update the version element
