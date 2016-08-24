const fs = require('fs');
const argv = require('yargs').argv;
const project = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

module.exports = {
    get env() {
        var env = process.env.NODE_ENV;

        if (argv.production) {
            env = 'production';
        } else if (argv.development) {
            env = 'development';
        }

        return env;
    },
    get dest() {
        return (this.env === 'development' ? 'dev' : 'dist');
    },
    src: 'src',
    browsers: [
        'last 3 versions',
        'not ie < 11'
    ],
    name: project.name,
    version: project.version,
    license: project.license,
    watchOpts: {
        usePolling: false,
        useFsEvents: true,
        followSymlinks: false,
        interval: 400,
        binaryInterval: 1000
    }
};
