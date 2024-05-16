import {describe, it} from '@jest/globals';
import querySchools, {MAX_SEARCH_RESULTS, queryById} from '~/models/query-schools';
import schoolData from './query-schools.data';


describe('query-schools', () => {
    it('pulls school data', async () => {
        let searchString = 'initial';

        (global.fetch as jest.Mock).mockImplementation((url: string) => {
            searchString = url;

            return Promise.resolve({
                ok: true,
                json() {
                    return Promise.resolve(schoolData);
                }
            });
        });
        const data = await querySchools('indiana', {partners: 'true'});

        expect(data.length).toBe(schoolData.length);
        expect(searchString).toMatch('schools/?q=indiana&key_institutional_partner=true');
    });
    it('returns no results if there are too many', async () => {
        const payload: [][] = [];

        payload[MAX_SEARCH_RESULTS] = [];
        (global.fetch as jest.Mock).mockImplementation(() => Promise.resolve({
            ok: true,
            json() {
                return Promise.resolve(payload);
            }
        }));
        const data = await querySchools('Indiana');

        expect(data.length).toBe(0);
    });
    it('does not query if query string is < 3 chars and not filters', async () => {
        (global.fetch as jest.Mock).mockImplementation(() => Promise.reject());
        const data = await querySchools('no');

        expect(data).toBeNull();
    });
    it('does queryById', async () => {
        (global.fetch as jest.Mock).mockImplementation(() => Promise.resolve({
            ok: true,
            json() {
                return Promise.resolve([schoolData[1]]);
            }
        }));
        const data = await queryById('1');

        expect(data.cityState).toBe('New Albany, Ohio');
    });
});
