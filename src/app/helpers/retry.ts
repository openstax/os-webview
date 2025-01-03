// From: https://dev.to/goenning/how-to-retry-when-react-lazy-fails-mb5
export default function retry(fn, retriesLeft = 3, interval = 1400) {
    return new Promise((resolve, reject) => {
        fn()
            .then(resolve)
            .catch((error) => {
                window.setTimeout(() => {
                    if (retriesLeft === 1) {
                        reject(new Error(`Maximum retries exceeded: ${error}`));
                        return;
                    }

                    // Passing on "reject" is the important part
                    retry(fn, retriesLeft - 1, interval).then(resolve, reject);
                }, interval);
            });
    });
}
