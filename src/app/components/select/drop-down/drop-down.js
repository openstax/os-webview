import React from 'react';
import Select from '../select';
import useSelectContext from '../select-context';
import useToggleContext, {ToggleContextProvider} from '~/components/toggle/toggle-context';
import ToggleControlBar from '~/components/toggle/toggle-control-bar';
import ArrowToggle from '~/components/toggle/arrow-toggle';
import VerticalList from '~/components/vertical-list/vertical-list';
import './drop-down.scss';

/* eslint-disable  */
function RenderItem({item, current, onMouseEnter, onClick}) {
    const {item: selectedItem} = useSelectContext();

    return (
        <div
            role="option"
            aria-selected={item === selectedItem}
            aria-current={current}
            onMouseEnter={onMouseEnter}
            onClick={onClick}
        >
            {item.label || item.text}
        </div>
    );
}

function SelectedItem({placeholder}) {
    const {item} = useSelectContext();

    return (
        <div className="selected-item">
            {
                item ?
                (item.label || item.text) :
                <span className="placeholder">{placeholder}</span>
            }
        </div>
    );
}

function AutoFocusVerticalList({options}) {
    const {isOpen, close} = useToggleContext();
    const {select} = useSelectContext();
    const vListRef = React.useRef();
    const onSelect = (value) => {
        select(value);
        close();
    };

    React.useEffect(() => {
        if (isOpen) {
            vListRef.current.focus();
        }
    }, [isOpen]);

    React.useEffect(() => {
        const initialSelection = options.find((opt) => opt.selected);

        if (initialSelection) {
            select(initialSelection);
        }
    }, [options, select])

    return (
        <div className="vl-wrapper" hidden={!isOpen}>
            <VerticalList
                items={options} RenderItem={RenderItem}
                onSelect={onSelect} onCancel={close}
                vListRef={vListRef}
            />
        </div>
    );
}

export default function DropDownSelect({options, placeholder='Please select', ...passThruProps}) {
    return (
        <Select {...passThruProps}>
            <ToggleContextProvider>
                <ToggleControlBar Indicator={ArrowToggle}>
                    <SelectedItem placeholder={placeholder} />
                </ToggleControlBar>
                <AutoFocusVerticalList options={options} />
            </ToggleContextProvider>
        </Select>
    );
}
