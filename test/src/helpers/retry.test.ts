import retry from '~/helpers/retry';

describe('retry', () => {
    it('retries rejections', async () => {
        const p = retry(
            () => {
                return Promise.reject('expected error');
            },
            2,
            100
        );

        await expect(p).rejects.toThrow();
    });
});
