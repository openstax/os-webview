import Bucket from '~/pages/home/buckets/bucket/bucket';

describe('Bucket', () => {
    const basicData = {
        heading: 'HEAD',
        content: 'some <b>HTML</b>',
        btnClass: 'button-class',
        link: '//example.com/somePage',
        cta: 'CTA text',
        image: {
            alignment: 'left'
        },
        bucketClass: 'b-class'
    };
    const p = new Bucket(Object.assign({
        hasImage: true
    }, basicData));
    const pNot = new Bucket(Object.assign({
        hasImage: false
    }, basicData));

    it('handles image div', () => {
        const getImageDiv = (bucket) => bucket.el.querySelector('div.image');

        console.info('Image div in here?', p.el.outerHTML);
        expect(getImageDiv(p)).toBeTruthy();
        expect(p.el.classList).toContain(basicData.bucketClass);
        expect(p.el.classList).toContain(basicData.image.alignment);
        expect(getImageDiv(pNot)).toBeFalsy();
        expect(p.el.querySelector('.btn').textContent).toBe(basicData.cta);
    });
});
