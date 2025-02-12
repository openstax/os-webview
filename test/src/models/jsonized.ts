export default function jsonized(content: unknown) {
    return Promise.resolve({
        json() {
            return Promise.resolve(content);
        }
    });
}
