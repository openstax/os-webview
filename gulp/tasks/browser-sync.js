const gulp = require('gulp');
const config = require('../config');
const bs = require('browser-sync').create(config.name);
const historyApiFallback = require('connect-history-api-fallback');

const corsHeaders = [
    'DNT',
    'Keep-Alive',
    'User-Agent',
    'X-Requested-With',
    'If-Modified-Since',
    'Cache-Control',
    'Accept-Encoding',
    'Content-Type'
];

function browserSync(done) {
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
    }, done);
}

function reload(done) {
    bs.reload();
    done();
}

gulp.task('browser-sync', browserSync);
gulp.task('reload-browser', reload);
