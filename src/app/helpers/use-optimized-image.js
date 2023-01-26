const distributionUrl = 'https://images.openstax.org';
const version = 'v1';

export default function useOptimizedImage(src, maxDim) {
    const url = new window.URL(src);
    const originalDomain = url.hostname;
    const originalPath = url.pathname;
    const format = (/\.(jpg|png)$/).test(src) ? 'webp' : 'orig';
    const directives = `f=${format},w=${maxDim},h=${maxDim}`;

    return `${distributionUrl}/apps/image-cdn/${version}/${originalDomain}/${directives}${originalPath}`;
}
