import isSupported from '~/helpers/device';
import {describe, it, expect} from '@jest/globals';

describe('Helpers($)', () => {
    it('checks browser', () => {
        expect(isSupported()).toBe(false);
    });
});
