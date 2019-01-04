'use strict';

const gulp = require('gulp');
const allTheThings = require('require-dir')('.', {recurse: true});

function findWatchers() {
    const objs = Object.values(allTheThings);
    const result = [];

    objs.forEach((obj) => {
        Object.entries(obj).filter(([k, v]) => {
            if ('watch' in v) {
                result.push(v.watch);
            }
        });
    });
    return result;
}

exports.watch = gulp.series(
    gulp.parallel(...findWatchers())
);
