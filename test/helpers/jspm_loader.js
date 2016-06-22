const path = require('path');
const jspm = require('jspm');

const pjsonLoc = require('find-pkg').sync(process.cwd());
const pjsonDir = path.parse(pjsonLoc).dir;

jspm.setPackagePath(pjsonDir);

global.SystemJS = jspm.Loader();
