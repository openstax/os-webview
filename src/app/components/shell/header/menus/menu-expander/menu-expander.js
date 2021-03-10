import React, {useEffect} from 'react';
import {DropdownContext} from '../dropdown-context';
import {useLocation} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './menu-expander.css';

function useFullScreenToggle(ref) {
    const [active, toggleActive] = useToggle(false);
    const reconfigure = () => {
        document.body.parentNode.classList.toggle('no-scroll');
        toggleActive();
    };

    useEffect(() => {
        const reset = () => {
            toggleActive(false);
            document.body.parentNode.classList.remove('no-scroll');
        };
        const resetOnResize = () => {
            if (!$.isMobileDisplay()) {
                reset();
            }
        };

        window.addEventListener('resize', resetOnResize);
        window.addEventListener('navigate', reset);
        return () => {
            window.removeEventListener('resize', resetOnResize);
            window.removeEventListener('navigate', reset);
        };
    }, [toggleActive]);

    function toggleExpanded() {
        const el = ref.current;

        el.style.transition = 'none';
        if (active) {
            $.fade(el, {fromOpacity: 1, toOpacity: 0}).then(() => {
                reconfigure();
                el.style.opacity = 1;
                el.style.transition = null;
            });
        } else {
            el.style.opacity = 0;
            reconfigure();
            $.fade(el, {fromOpacity: 0, toOpacity: 1}).then(() => {
                el.style.transition = null;
            });
        }
    }

    return [active, toggleExpanded];
}

export default function MenuExpander({active, onClick}) {
    const ref = React.useRef();
    const location = useLocation();
    const {setActiveDropdown} = React.useContext(DropdownContext);

    useEffect(() => {
        if (active) {
            onClick();
            setActiveDropdown({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);


    function onClickAndBlur(event) {
        onClick(event);
        ref.current.blur();
    }

    return (
        <button
            type="button"
            className="expand"
            aria-haspopup="true" aria-label="Toggle Meta Navigation Menu"
            tabindex="0"
            onClick={onClickAndBlur}
            ref={ref}
        >
            <span />
        </button>
    );
}
