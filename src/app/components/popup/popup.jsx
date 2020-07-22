import React, {useEffect} from 'react';
import WrappedJsx from '~/controllers/jsx-wrapper';
import './popup.css';
import shellBus from '~/components/shell/shell-bus';

function PopupJsx({message, onClose}) {
    useEffect(() => {
        shellBus.emit('with-modal');

        return () => shellBus.emit('no-modal');
    }, []);

    function maybeGoAway(event) {
        event.preventDefault();
        if ([' ', 'Enter', 'Escape'].includes(event.key)) {
            onClose();
        }
    }

    return (
        <div className="overlay" onKeyDown={maybeGoAway}>
            <div role="dialog" aria-describedby="popupMessage">
                <p id="popupMessage">{message}</p>
                <button type="button" className="dismiss" tabindex="1" onClick={onClose}>
                    Got it
                </button>
            </div>
        </div>
    );
}

export function WrappedPopupJsx(props) {
    return (
        <pop-up className="page-overlay">
            <PopupJsx {...props} />
        </pop-up>
    );
}

const view = {
    tag: 'pop-up',
    classes: ['page-overlay']
};

export default class Popup extends WrappedJsx {

    init(message) {
        super.init(PopupJsx, {message, onClose: () => this.detach()});
        this.view = view;
    }

    onClose() {
        this.el.remove();
        shellBus.emit('no-modal');
    }

}
