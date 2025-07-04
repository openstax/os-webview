import React from 'react';
import Multiselect, {MultiselectContextProvider} from '../multiselect';
import useSFBookContext, {SFBookContextProvider} from './sf-book-context';
import useMultiselectContext from '../multiselect-context';
import useToggleContext from '~/components/toggle/toggle-context';
import Toggle, {IfToggleIsOpen} from '~/components/toggle/toggle';
import ToggleControlBar from '~/components/toggle/toggle-control-bar';
import ArrowToggle from '~/components/toggle/arrow-toggle';
import BookOptions from './book-options';
import PutAway from '~/components/put-away/put-away';
import './book-tags.scss';

type Item = {
    text: string;
    label: string;
    value: string;
};

function Tag({item}: {item: Item}) {
    const {deselect} = useMultiselectContext();
    const onClick = React.useCallback(() => {
        deselect(item);
    }, [deselect, item]);

    return (
        <span className="removable-tag">
            {item.label || item.text}
            <PutAway onClick={onClick} ariaLabel="remove" />
        </span>
    );
}

function capture(event: React.MouseEvent<HTMLInputElement, MouseEvent>) {
    event.stopPropagation();
}

function Filter() {
    const {filter, setFilter} = useSFBookContext();
    const {toggle} = useToggleContext();
    const ref = React.useRef(null);
    const onChange = React.useCallback(
        ({target: {value}}: React.ChangeEvent<HTMLInputElement>) =>
            setFilter(value),
        [setFilter]
    );

    // Force toggle open if using filter
    // If filter is cleared, close toggle and refocus to input (after toggle grabs focus)
    React.useEffect(() => toggle(filter.length > 0), [toggle, filter]);

    return (
        <input
            placeholder="Filter titles"
            onClick={capture}
            value={filter}
            onChange={onChange}
            ref={ref}
        />
    );
}

function TagList() {
    const {selectedItems} = useMultiselectContext();

    return (
        <div className="tag-list">
            {(selectedItems as Item[]).map((i) => (
                <Tag key={i.value} item={i} />
            ))}
            <Filter />
        </div>
    );
}

// BookTagsMultiselect must be wrapped in a SFBookContextProvider,
// which must itself be wrapped in a MultiselectContextProvider.
// This is a convenience wrapper so you just need one tag
export function BookTagsContextProvider({
    selected,
    booksAllowed,
    children,
    maxSelections
}: React.PropsWithChildren<{
    selected?: string[];
    booksAllowed?: string[];
    maxSelections: number;
}>) {
    return (
        <MultiselectContextProvider contextValueParameters={{maxSelections}}>
            <SFBookContextProvider
                contextValueParameters={{selected, booksAllowed}}
            >
                {children}
            </SFBookContextProvider>
        </MultiselectContextProvider>
    );
}

export function useBookTagsContext() {
    return {...useMultiselectContext(), ...useSFBookContext()};
}

type MultiselectArgs = Parameters<typeof Multiselect>[0];

export default function BookTagsMultiselect(passThruProps: MultiselectArgs) {
    return (
        <Multiselect {...passThruProps}>
            <Toggle>
                <ToggleControlBar Indicator={ArrowToggle}>
                    <TagList />
                </ToggleControlBar>
                <IfToggleIsOpen>
                    <BookOptions />
                </IfToggleIsOpen>
            </Toggle>
        </Multiselect>
    );
}
