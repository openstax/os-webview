import React from 'react';
import {render, screen} from '@testing-library/preact';
import {describe, it, expect} from '@jest/globals';
import AccordionGroup from '~/components/accordion-group/accordion-group';

describe('components/accordion-group', () => {
    it('gives blank titles a valid uuid', () => {
        const error = jest.spyOn(console, 'error').mockImplementation(() => null);

        render(
            <AccordionGroup
                items={[
                    {title: '', contentComponent: <div>first answer</div>},
                    {title: '', contentComponent: <div>second answer</div>}
                ]}
            />
        );

        // react-accessible-accordion console.errors on an empty uuid
        expect(error).not.toHaveBeenCalled();
        expect(screen.getAllByRole('button')).toHaveLength(2);
        error.mockRestore();
    });
    it('derives uuids from titles', () => {
        render(
            <AccordionGroup
                items={[{title: 'my cool accordion', contentComponent: <div>answer</div>}]}
                preExpanded={['my cool accordion']}
            />
        );
        expect(
            screen.getByRole('button').getAttribute('aria-expanded')
        ).toBe('true');
    });
});
