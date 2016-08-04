const Module = require('module');
const jspm = require('jspm');
const path = require('path');
const url = require('url');
const load = Module._load;

function debug() {
    if (process.env.AVA_JSPM_LOADER_DEBUG) {
        console.log.apply(console, arguments);
    }
}

const pjsonLoc = require('find-pkg').sync(process.cwd());
const pjsonDir = path.parse(pjsonLoc).dir;
const pjson = require(pjsonLoc);

debug(`[loader:internal] package.json location: ${pjsonLoc}`)

jspm.setPackagePath(pjsonDir)

const System = jspm.Loader();

System.config({
    packages: {
        [pjson.jspm.name]: {
            defaultExtension: "js"
        }
    }
});

function jspmHasModule(name) {
    if (/^(\.\/|\.\.\/|\/)/.test(name)) {
        return false;
    }

    const possiblePaths = [name + '/'];
    let i = -1;

    while (~(i = name.lastIndexOf('/'))) {
        name = name.substr(0, i);
        possiblePaths.push(name + '/');
    }

    debug(`[loader:internal] possible paths: ${possiblePaths}`);

    return possiblePaths.some((p) => {
        return p in System.paths || p.slice(0, -1) in System.map;
    });
}

Module._load = (name, m) => {
    debug(`[loader:internal] ${name} in System._loader.modules: ${name in System._loader.modules}`);

    if (name in System._loader.modules) {
        return System._loader.modules[name].module;
    }

    debug(`[loader:internal] jspmHasModule(${name}): ${jspmHasModule(name)}`);

    if (jspmHasModule(name)) {
        let jspmUri = System.normalizeSync(name);

        debug(`[loader:internal] successfully normalized: ${jspmUri}`);

        if (~jspmUri.indexOf('nodelibs-')) {
            debug(`[loader:internal] Detected a "nodelibs" shim. Deferring to node.`);
        } else {
            name = url.parse(jspmUri).path;
            debug(`[loader:internal] parsed module path: ${name}`);
        }
    }

    return load(name, m);
}
