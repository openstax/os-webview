import React from 'react';
import {render, screen} from '@testing-library/preact';
import Multiselect, {
    MultiselectContextProvider,
    useMultiselectContext
} from '~/components/multiselect/multiselect';

describe('multiselect', () => {
    function Selector() {
        const {select} = useMultiselectContext();

        React.useEffect(() => select({value: 'one', text: 'one'}), [select]);

        return null;
    }
    function Component({
        children,
        ...msProps
    }: React.PropsWithChildren<Parameters<typeof Multiselect>[0]>) {
        return (
            <MultiselectContextProvider
                contextValueParameters={{maxSelections: 2}}
            >
                <Multiselect name="necessary" {...msProps}>
                    {children}
                </Multiselect>
            </MultiselectContextProvider>
        );
    }
    it('renders as hidden multiselect', async () => {
        render(
            <Component>
                <Selector />
            </Component>
        );
        await screen.findByRole('listbox', {hidden: true});
    });
    it('calls onChange when selection is made', async () => {
        const onChange = jest.fn();

        render(
            <Component onChange={onChange}>
                <Selector />
            </Component>
        );
        expect(onChange).toHaveBeenCalled();
    });
    it('renders a hidden single field', async () => {
        render(
            <Component oneField={true}>
                <Selector />
            </Component>
        );
        const hiddenField: HTMLInputElement = await screen.findByRole(
            'textbox',
            {hidden: true}
        );

        expect(hiddenField.value).toBe('one');
    });
    it('stops adding at maxSelections items', async () => {
        function TooMany() {
            const {select} = useMultiselectContext();

            React.useEffect(() => {
                select({value: 'one', text: 'one'});
                select({value: 'two', text: 'two'});
                select({value: 'three', text: 'three'});
            }, [select]);

            return null;
        }

        render(
            <Component oneField={true}>
                <TooMany />
            </Component>
        );
        const hiddenField: HTMLInputElement = await screen.findByRole(
            'textbox',
            {hidden: true}
        );

        expect(hiddenField.value).toBe('one;two');
    });
});
