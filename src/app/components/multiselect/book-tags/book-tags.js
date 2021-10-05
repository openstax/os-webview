import React from 'react';
import Multiselect from '../multiselect';
import useMultiselectContext from '../multiselect-context';
import {ToggleContextProvider} from '~/components/toggle/toggle-context';
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

function TagList() {
    const {selectedItems} = useMultiselectContext();

    return (
        <div className="tag-list">
            {selectedItems.map((i) => <Tag key={i} item={i} />)}
        </div>
    );
}

export default function BookTagsMultiselect(passThruProps) {
    return (
        <Multiselect {...passThruProps}>
            <ToggleContextProvider>
                <ToggleControlBar Indicator={ArrowToggle}>
                    <TagList />
                </ToggleControlBar>
                <IfToggleIsOpen>
                    <BookOptions />
                </IfToggleIsOpen>
            </ToggleContextProvider>
        </Multiselect>
    );
}
