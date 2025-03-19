import {useState} from 'react';

type SearchableItem = {
    label: string;
};

export default function useSelectList<ItemType=SearchableItem>({
    getItems,
    accept,
    cancel = () => null,
    minActiveIndex = 0,
    searchable = true
}: {
    getItems: () => ItemType[];
    accept: (item: ItemType) => void;
    cancel?: () => void;
    minActiveIndex?: number;
    searchable?: boolean;
}) {
    const [activeIndex, setActiveIndex] = useState(-1);

    // eslint-disable-next-line complexity
    function handleKeyDown(event: React.KeyboardEvent) {
        let handled = true;
        const items = getItems();

        switch (event.key) {
            case 'Enter':
            case ' ':
                if (activeIndex > -1) {
                    accept(items[activeIndex]);
                    event.preventDefault();
                    setActiveIndex(-1);
                } else {
                    handled = false;
                }
            // eslint-disable-next-line no-fallthrough
            case 'Escape':
                cancel();
                break;
            case 'ArrowDown':
                setActiveIndex(
                    Math.min(
                        Math.max(activeIndex + 1, minActiveIndex),
                        items.length - 1
                    )
                );
                break;
            case 'ArrowUp':
                setActiveIndex(Math.max(activeIndex - 1, minActiveIndex));
                break;
            default:
                if (searchable && event.key?.length === 1) {
                    const letter = event.key.toLowerCase();
                    const values = Array.from(items).map((opt) =>
                        (opt as SearchableItem).label.toLowerCase()
                    );
                    let foundIndex = values.findIndex(
                        (val, i) => i > activeIndex && val.startsWith(letter)
                    );

                    if (!(foundIndex > -1)) {
                        foundIndex = values.findIndex((val) =>
                            val.startsWith(letter)
                        );
                    }
                    if (foundIndex > -1) {
                        setActiveIndex(foundIndex);
                    }
                } else {
                    handled = false;
                }
        }

        return handled;
    }

    return [activeIndex, handleKeyDown, setActiveIndex] as const;
}
