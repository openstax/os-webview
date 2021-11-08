import React from 'react';
import useVListContext, {VListContextProvider} from './vlist-context';

function RenderInContext({items, RenderItem, vListRef, onSelect, onCancel}) {
    const {count, setCount, index, setIndex} = useVListContext();

    React.useEffect(() => setCount(items.length), [items, setCount]);

    // eslint-disable-next-line complexity
    const onKeyDown = (event) => {
        switch (event.key) {
        case 'ArrowDown':
            setIndex(Math.min(index+1, count-1));
            event.preventDefault();
            event.stopPropagation();
            break;
        case 'ArrowUp':
            setIndex(Math.max(index-1, -1));
            event.preventDefault();
            event.stopPropagation();
            break;
        case ' ':
        case 'Enter':
            onSelect(items[index]);
            event.preventDefault();
            event.stopPropagation();
            break;
        case 'Escape':
            onCancel();
            event.preventDefault();
            event.stopPropagation();
            break;
        default: break;
        }
    };

    return (
        <div
            className="vertical-list" tabIndex="0" ref={vListRef}
            onBlur={onCancel} onKeyDown={onKeyDown}
        >
            {
                items.map((item, i) =>
                    <RenderItem
                        key={item.label} item={item}
                        current={index === i}
                        onMouseEnter={() => setIndex(i)}
                        onClick={() => onSelect(item)}
                    />)
            }
        </div>
    );
}

export default function VerticalList(props) {
    return (
        <VListContextProvider>
            <RenderInContext {...props} />
        </VListContextProvider>
    );
}
