<p align="center">
    <a href="https://openstax.org">
        <img height="51" width="251" src="https://cdn.jsdelivr.net/gh/openstax/os-webview@master/src/images/logo.svg">
    </a>
</p>

# OpenStax

[![Build Status](https://travis-ci.org/openstax/os-webview.svg?branch=master)](https://travis-ci.org/openstax/os-webview)
[![Code Climate](https://codeclimate.com/github/openstax/os-webview/badges/gpa.svg)](https://codeclimate.com/github/openstax/os-webview)

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
script/setup
```

## Build and Run the Development Server

To build the site for development and load it in your default web browser with [BrowserSync](http://www.browsersync.io), simply run:

```bash
. script/bootstrap
script/dev
```

That will create a new `dev` directory from which the site is served.  Changes should be made to files in the `src` directory.  Webpack will automatically watch for changes in `src`, perform any compilation and transpilation necessary, and update the result in `dev`.

## Testing

To run the linters and unit tests locally, enter:

```bash
script/build
script/test
```

You can also just run the linters (`yarn lint`) individually without rebuilding.
You can run individual tests by name (`yarn jest layout.test`).

Check code coverage by loading into your browser `/coverage/index.html` from the
root of the git repository.

**Note:** The unit tests require the dev build to be built (in the `dev` directory).

## Build for Production

```bash
./script/build production
```

You must configure your web server to host the files in the `dist` directory that gets created.  No special configuration is required, although it is highly recommended to serve the site using HTTP/2.

## Configuration

The API_ORIGIN environment variable can be used to specify which [CMS](https://github.com/openstax/openstax-cms) instance is used by os-webview.
os-webview settings are loaded from the specified CMS instance's webview-settings API.
The default API_ORIGIN for script/dev is https://dev.openstax.org

## Upgrading Dependencies

You can upgrade dependencies manually or you can upgrade all of them by running `./script/upgrade && ./script/test`.

## Updating Version

The version must be updated in each release to help prevent browser caching issues. The version is updated in 3 locations.

1. [version.js](https://github.com/openstax/os-webview/blob/master/src/app/version.js) Update the constant.
2. [index.html](https://github.com/openstax/os-webview/blob/master/src/index.html) Update the version on reference to main.css and bundle.js
3. [package.json](https://github.com/openstax/os-webview/blob/master/package.json) Update the version element
