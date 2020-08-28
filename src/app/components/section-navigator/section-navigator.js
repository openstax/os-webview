import React, {useState, useEffect, useContext} from 'react';
import $ from '~/helpers/$';
import {WindowContextProvider, WindowContext} from '~/components/jsx-helpers/jsx-helpers.jsx';
import cn from 'classnames';
import './section-navigator.css';

function Hotspot({id, selectedId, setSelectedId}) {
    return (
        <div
            className={cn('hotspot', {selected: selectedId === id})}
            onClick={() => setSelectedId(id)}
        >
            <span class="dot" />
        </div>
    );
}

function SectionNavigator({idList}) {
    const [selectedId, setSelectedId] = useState(idList[0]);
    const wcx = useContext(WindowContext);

    useEffect(() => {
        const el = document.getElementById(selectedId);
        const target = document.getElementById(`${selectedId}-target`);

        if (el) {
            $.scrollTo(target || el);
        }
    }, [selectedId]);

    useEffect(() => {
        const sections = idList.map((id) => document.getElementById(id));
        const firstWhoseMiddleIsVisible = sections.find((el) => {
            const rect = el.getBoundingClientRect();
            const middle = (rect.top + rect.bottom) / 2;

            return middle >= 0;
        });

        setSelectedId(firstWhoseMiddleIsVisible && firstWhoseMiddleIsVisible.id);
    }, [idList, wcx]);

    return (
        idList.map((id) =>
            <Hotspot key={id} {...{id, selectedId, setSelectedId}} />
        )
    );
}

export default function SectionNavigatorWait({idList}) {
    if (idList.length === 0) {
        return null;
    }

    return (
        <WindowContextProvider>
            <div className="section-navigator">
                <SectionNavigator idList={idList} />
            </div>
        </WindowContextProvider>
    );
}
