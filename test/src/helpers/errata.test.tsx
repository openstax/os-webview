import React from 'react';
import {render, screen} from '@testing-library/preact';
import {
    approvedStatuses,
    getDisplayStatus,
    useErrataDetail,
    Errata
} from '~/helpers/errata';

describe('errata helpers', () => {
    it('identifies rules', () => {
        expect(approvedStatuses('2017/1/15', '2017/10/1').status).toBe(
            'Corrected Oct 2017'
        );
        expect(approvedStatuses('2040/1/15', null).status).toBe(
            'Will correct Fall 2040'
        );
        expect(approvedStatuses('2040/3/15', null).status).toBe(
            'Will correct Spring 2041'
        );
    });
    describe('getDisplayStatus', () => {
        it('exits when no data', () => {
            expect(getDisplayStatus()).toEqual({
                status: 'Reviewed',
                barStatus: ''
            });
        });
        it('recognizes duplicate', () => {
            expect(
                getDisplayStatus({
                    status: 'Completed',
                    resolution: 'Duplicate'
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any)
            ).toEqual({status: 'Duplicate', barStatus: 'Duplicate'});
        });
    });
    describe('useErrataDetail', () => {
        function Component() {
            const detail = useErrataDetail({
                id: '1',
                resource: 'Other',
                reviewedDate: '2025-02-06',
                correctedDate: null,
                book: 123,
                resourceOther: 'foo',
                status: 'live',
                resolution: 'high',
                resolutionNotes: '',
                created: '2000-01-01',
                detail: '',
                errorType: ''
            } as unknown as Errata);

            return (
                <div>
                    <div>source=[{detail?.source}]</div>
                    <div>title=[{detail?.bookTitle}]</div>
                </div>
            );
        }
        it('handles data.resource of "Other" and book not found', async () => {
            render(<Component />);
            await screen.findByText('source=[foo]');
            screen.getByText('title=[]');
        });
    });
});
