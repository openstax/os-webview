import React, {useRef, useState} from 'react';
import {useToggle, RawHTML, useDataFromPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import bookToc from '~/models/book-toc';
import './module-list.css';

function ContentGroup({item, children}) {
    const [expanded, toggleExpanded] = useToggle();
    const [checkedChildren, setCheckedChildren] = useState(0);
    const pinnedIcon = checkedChildren > 0 ? 'thumbtack' : 'caret-down';
    const icon = expanded ? pinnedIcon : 'caret-right';

    function onClick() {
        if (checkedChildren === 0) {
            toggleExpanded();
        }
    }

    function childClicked(event) {
        const target = event.currentTarget;

        setCheckedChildren(Array.from(target.querySelectorAll(':checked')).length);
    }

    return (
        <React.Fragment>
            <div
                className="toggle" onClick={onClick}
                role="button" aria-expanded={expanded}
            >
                <FontAwesomeIcon icon={icon} />
                <RawHTML html={item.title} />
            </div>
            <div className="indent" hidden={!expanded} onClick={childClicked}>
                {children}
            </div>
        </React.Fragment>
    );
}

function SelectableModule({item, selectedModules}) {
    const [checked, toggle] = useToggle(false);

    function onClick(event) {
        const disabled = !checked && selectedModules.isFull;

        if (disabled) {
            event.preventDefault();
            return;
        }

        if (checked) {
            selectedModules.remove(item.slug);
        } else {
            selectedModules.add(item.slug, item.title);
        }
        toggle();
    }

    return (
        <label>
            <input
                type="checkbox" name="module" value={item.slug}
                {...{onClick, checked}}
            />
            <RawHTML html={item.title} />
        </label>
    );
}

function ModuleSelector({item, selectedModules}) {
    const isNumbered = item.title.includes('os-divider');

    return (
        <div>
            {
                isNumbered ?
                    <SelectableModule {...{item, selectedModules}} /> :
                    <RawHTML className="not-selectable" html={item.title} />
            }
        </div>
    );
}

function ModuleList({contents, selectedModules}) {
    return (
        <div className="module-list">
            {
                contents.map((entry) =>
                    entry.contents ?
                        <ContentGroup key={entry.slug} item={entry}>
                            <ModuleList contents={entry.contents} selectedModules={selectedModules} />
                        </ContentGroup> :
                        <ModuleSelector key={entry.slug} item={entry} selectedModules={selectedModules} />
                )
            }
        </div>
    );
}

export default function LoadModuleList({model, selectedModules}) {
    const contents = useDataFromPromise(bookToc(model.meta.slug), []);

    return (
        <ModuleList contents={contents} selectedModules={selectedModules} />
    );
}
