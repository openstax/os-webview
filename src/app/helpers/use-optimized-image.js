const distributionUrl = 'https://images.openstax.org';
const version = 'v1';

export default function useOptimizedImage(src, maxDim) {
    const url = new window.URL(src);
    const originalDomain = url.hostname;
    const originalPath = url.pathname;
    const format = (/\.(jpg|png)$/).test(src) ? 'webp' : 'orig';
    const dims = maxDim ? `,w=${maxDim},h=${maxDim}` : '';
    const directives = `f=${format}${dims}`;

    return `${distributionUrl}/apps/image-cdn/${version}/${originalDomain}/${directives}${originalPath}`;
}
