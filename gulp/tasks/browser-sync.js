var gulp = require('gulp');
var config = require('../config');
var bs = require('browser-sync').create(config.name);
var historyApiFallback = require('connect-history-api-fallback');

const corsHeaders = [
    'DNT',
    'Keep-Alive',
    'User-Agent',
    'X-Requested-With',
    'If-Modified-Since',
    'Cache-Control',
    'Content-Type'
];

function browserSync() {
    bs.init({
        server: {
            baseDir: `./${config.dest}`,
            middleware: [
                historyApiFallback(),
                function cors(req, res, next) {
                    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
                    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE');
                    res.setHeader('Access-Control-Allow-Headers', corsHeaders.join(','));
                    res.setHeader('Access-Control-Allow-Credentials', 'true');

                    next();
                }
            ]
        }
    });
    return Promise.resolve();
}

gulp.task('browser-sync', browserSync);
