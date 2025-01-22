import {approvedStatuses} from '~/helpers/errata';

describe('errata helpers', () => {
    it('identifies rules', () => {
        expect(approvedStatuses('2017/1/15').status).toBe('Corrected Fall 2017');
        expect(approvedStatuses('2040/1/15').status).toBe('Will correct Fall 2040');
        expect(approvedStatuses('2017/3/15').status).toBe('Corrected Spring 2018');
        expect(approvedStatuses('2040/3/15').status).toBe('Will correct Spring 2041');
        expect(approvedStatuses('2017/12/15').status).toBe('Corrected Fall 2018');
        expect(approvedStatuses('2040/12/15').status).toBe('Will correct Fall 2041');
    });
});
