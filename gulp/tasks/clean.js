const {dest} = require('../config');
const {del} = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del']
});

function clean() {
    return del([dest], {dot: true});
}

exports.clean = clean;
