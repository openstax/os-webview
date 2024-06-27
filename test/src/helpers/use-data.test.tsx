import React from 'react';
import {describe, it, expect} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import useFetchedData from '~/helpers/use-data';

function Component<E>({
    options,
    compare
}: {
    options: Parameters<typeof useFetchedData>;
    compare: E;
}) {
    const data = useFetchedData(...options) as E;

    if (JSON.stringify(data) === JSON.stringify(compare)) {
        return <div>ok</div>;
    }
    return <div>waiting</div>;
}

describe('use-data', () => {
    it('handles empty slug', () => {
        const options: Parameters<typeof useFetchedData<string>> = [
            {
                slug: ''
            },
            'hold'
        ];

        render(<Component options={options} compare="hold" />);
    });
    it('handles url', async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                json() {
                    return 'fetch-output';
                }
            })
        );

        render(
            <Component
                options={[{url: 'anything'}, 'never']}
                compare="fetch-output"
            />
        );
        expect(global.fetch as jest.Mock).toHaveBeenCalledWith('anything');
        await screen.findByText('ok');
    });
    it('handles camelCase', async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                json() {
                    return {silly_key: 'silly_value'}; // eslint-disable-line camelcase
                }
            })
        );
        const camelCaseResult = {sillyKey: 'silly_value'};

        render(
            <Component
                options={[{url: 'camelcase', camelCase: true}, 'never']}
                compare={camelCaseResult}
            />
        );
        expect(global.fetch as jest.Mock).toHaveBeenCalledWith('camelcase');
        await screen.findByText('ok');
    });
    it('handles transform', async () => {
        const input = {
            datum: [
                {
                    type: 'content',
                    value: [1, 2]
                }
            ]
        };
        const output = {
            datum: {
                content: [1, 2]
            }
        };

        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                json() {
                    return input;
                }
            })
        );

        render(
            <Component
                options={[{url: 'transform', transform: true}, 'never']}
                compare={output}
            />
        );
        expect(global.fetch as jest.Mock).toHaveBeenCalledWith('transform');
        await screen.findByText('ok');
    });
    it('handles postprocess', async () => {
        const input = [1, 2, 3];
        const output = [2, 3, 4];

        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                json() {
                    return input;
                }
            })
        );

        render(
            <Component
                options={[
                    {
                        url: 'transform',
                        postProcess: (a) => {
                            return (a as number) + 1;
                        }
                    },
                    'never'
                ]}
                compare={output}
            />
        );
        expect(global.fetch as jest.Mock).toHaveBeenCalledWith('transform');
        await screen.findByText('ok');
    });
});
