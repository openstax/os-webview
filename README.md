<p align="center">
    <a href="https://openstax.org">
        <img height="51" width="251" src="https://cdn.jsdelivr.net/gh/openstax/os-webview@master/src/images/logo.svg">
    </a>
</p>

# OpenStax

[![Build Status](https://github.com/openstax/os-webview/actions/workflows/build.yml/badge.svg)](https://github.com/openstax/os-webview/actions/workflows/build.yml)

## Requirements

* [nvm](https://github.com/creationix/nvm)

## Release process

Releases are based on a GitHub [tag](https://github.com/openstax/os-webview/tags), which is based on
the version number of the release. The normal process is:

1. Check out a new branch
2. Update the version number in package.json
3. Update dependencies
4. Commit changes
5. Create and push a tag
6. Create a GitHub release

### Detailed Release Steps

Steps are given for command-line Git, but they can also be done in GitHub Desktop.

#### 1. Check out a new branch

Create a new branch for the release:

```bash
git checkout -b release-v2.148.0
```

#### 2. Update the version number

Update the version in `package.json` to the new version number (e.g., `2.148.0`). This is the only
file that needs to be updated for versioning. We typically increment the middle number. The right
number increments for hotfixes.

```bash
# Edit package.json and update the "version" field
```

#### 3. Update dependencies

Run `yarn upgrade` to update the yarn.lock file with the latest compatible dependency versions:

```bash
yarn upgrade
```

After upgrading, run tests to ensure everything still works:

```bash
./script/build
./script/test
```

If tests fail, investigate and fix any issues before proceeding.

#### 4. Commit changes

Commit the version bump and any dependency updates:

```bash
git add package.json yarn.lock
git commit -m "Release v2.148.0"
git push origin release-v2.148.0
```

#### 5. Create and push a tag

Create a tag with the version number (note the `v` prefix):

```bash
git tag v2.148.0
git push origin v2.148.0
```

The tag name should match the format `v{major}.{minor}.{patch}` (e.g., `v2.148.0`).

#### 6. Create a GitHub release

Go to [Releases on GitHub](https://github.com/openstax/os-webview/releases) and click "Draft a new release":

1. Select the tag you just created (e.g., `v2.148.0`)
2. Set the release title to match the tag (e.g., `v2.148.0`)
3. Add release notes describing the changes
4. Click "Publish release"

We use the release to document which is the latest published version. Keep it as a pre-release
until it has been deployed to production.

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
