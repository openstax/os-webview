const DEFAULT_TIMEOUT_MS = 15 * 60 * 1000;

class JsonDataCache {

    constructor(url) {
        this.url = url;
        this.timeout = DEFAULT_TIMEOUT_MS;
    }

    load() {
        if (!this.promise) {
            this.promise = new Promise((resolve, reject) =>
                fetch(this.url)
                .then((response) =>
                    response.ok ? resolve(response.json()) : reject(response)
                )
                .catch((e) => reject(e))
            );
            clearTimeout(this.scheduledCleanup);
            this.scheduledCleanup = setTimeout(() => {
                this.promise = null;
            }, this.timeout);
        }
        return this.promise;
    }

}

class JsonDataCacheManager {

    constructor() {
        this.models = {};
    }

    load(url) {
        if (!(url in this.models)) {
            this.models[url] = new JsonDataCache(url);
        }
        return this.models[url].load();
    }

}

export default new JsonDataCacheManager();
