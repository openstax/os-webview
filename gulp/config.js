var fs = require('fs');
var project = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

module.exports = {
    get env() {
        return process.env.NODE_ENV || 'production';
    },
    get dest() {
        return (process.env.NODE_ENV === 'development' ? 'dev' : 'dist');
    },
    src: 'src',
    browsers: [
        'last 2 versions',
        'not ie < 12'
    ],
    name: project.name,
    version: project.version,
    license: project.license
};
