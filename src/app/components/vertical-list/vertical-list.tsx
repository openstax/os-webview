import React from 'react';
import useVListContext, {VListContextProvider} from './vlist-context';

type LabeledItem = {
    label: string;
};

export type RenderItemProps<Item> = {
    item: Item;
    current: boolean;
    onMouseEnter: React.MouseEventHandler;
    onClick: React.MouseEventHandler;
};

type VerticalListProps<Item> = {
    items: Item[];
    RenderItem: (props: RenderItemProps<Item>) => React.JSX.Element;
    vListRef: React.RefObject<HTMLDivElement>;
    onSelect: (i: Item) => void;
    onCancel: () => void;
};

function RenderInContext<T extends LabeledItem>({
    items,
    RenderItem,
    vListRef,
    onSelect,
    onCancel
}: VerticalListProps<T>) {
    const {count, setCount, index, setIndex} = useVListContext();

    React.useEffect(() => setCount(items.length), [items, setCount]);

    const onKeyDown = (event: React.KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowDown':
                setIndex(Math.min(index + 1, count - 1));
                event.preventDefault();
                event.stopPropagation();
                break;
            case 'ArrowUp':
                setIndex(Math.max(index - 1, -1));
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
            default:
                break;
        }
    };

    return (
        <div
            className="vertical-list"
            tabIndex={0}
            ref={vListRef}
            onBlur={onCancel}
            onKeyDown={onKeyDown}
            role="listbox"
        >
            {items.map((item, i) => (
                <RenderItem
                    key={item.label}
                    item={item}
                    current={index === i}
                    onMouseEnter={() => setIndex(i)}
                    onClick={() => onSelect(item)}
                />
            ))}
        </div>
    );
}

export default function VerticalList<T extends LabeledItem>(
    props: VerticalListProps<T>
) {
    return (
        <VListContextProvider>
            <RenderInContext {...props} />
        </VListContextProvider>
    );
}
