import React from 'react';
import Multiselect from '../multiselect';
import useSFBookContext, {SFBookContextProvider} from './sf-book-context';
import useMultiselectContext from '../multiselect-context';
import useToggleContext, {ToggleContextProvider} from '~/components/toggle/toggle-context';
import {IfToggleIsOpen} from '~/components/toggle/toggle';
import ToggleControlBar from '~/components/toggle/toggle-control-bar';
import ArrowToggle from '~/components/toggle/arrow-toggle';
import BookOptions from './book-options';
import PutAway from '~/pages/my-openstax/put-away/put-away';
import './book-tags.scss';

function Tag({item}) {
    const {deselect} = useMultiselectContext();

    function onClick(event) {
        event.stopPropagation();
        deselect(item);
    }

    return (
        <span className="removable-tag">
            {item.label || item.text}
            <PutAway onClick={onClick} />
        </span>
    );
}

function capture(event) {
    event.stopPropagation();
}

function Filter() {
    const {filter, setFilter} = useSFBookContext();
    const {toggle} = useToggleContext();
    const ref = React.useRef();

    function onChange({target: {value}}) {
        setFilter(value);
    }

    // Force toggle open if using filter
    // If filter is cleared, close toggle and refocus to input (after toggle grabs focus)
    React.useEffect(
        () => toggle(filter.length > 0),
        [toggle, filter]
    );

    return (
        <input
            placeholder="Filter titles" onClick={capture}
            value={filter} onChange={onChange} ref={ref}
        />
    );
}

function TagList() {
    const {selectedItems} = useMultiselectContext();

    return (
        <div className="tag-list">
            {selectedItems.map((i) => <Tag key={i} item={i} />)}
            <Filter />
        </div>
    );
}

export default function BookTagsMultiselect({selected, booksAllowed, ...passThruProps}) {
    return (
        <Multiselect {...passThruProps}>
            <SFBookContextProvider contextValueParameters={{selected, booksAllowed}}>
                <ToggleContextProvider>
                    <ToggleControlBar Indicator={ArrowToggle}>
                        <TagList />
                    </ToggleControlBar>
                    <IfToggleIsOpen>
                        <BookOptions />
                    </IfToggleIsOpen>
                </ToggleContextProvider>
            </SFBookContextProvider>
        </Multiselect>
    );
}
