import React from 'react';
import WrappedJsx from '~/controllers/jsx-wrapper';
import './progress-bar.css';

// eslint-disable-next-line complexity
export function ProgressBar({status, barStatus}) {
    const thirdNodeFill = ['Corrected', 'Will correct'].includes(barStatus) ?
        ' filled' : ' filled-no';
    const bars = barStatus ? 2 : {
        'In Review': 0,
        'Reviewed': 1,
        'Will Correct': 1
    }[status];
    const firstNodeClass = bars === 0 ? ' filled ' : '';
    const secondNodeClass = bars === 1 ? ' filled' : '';
    const thirdNodeClass = bars > 1 ? thirdNodeFill : '';

    return (
        <React.Fragment>
            <div className="progress-bar-labels">
                <div className="label">
                    <div className="event">In Review</div>
                </div>
                <div className="label">
                    <div className="event">Reviewed</div>
                </div>
                <div className="label">
                    <div className="event">{barStatus || 'Corrected'}</div>
                </div>
            </div>
            <div className="progress-bar">
                <div className="progress-bar-layer">
                    <div className="bar"></div>
                    <div className="bar"></div>
                </div>
                <div className="progress-bar-layer">
                    <div className={`node${firstNodeClass}`}></div>
                    <div className={`node${secondNodeClass}`}></div>
                    <div className={`node${thirdNodeClass}`}></div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default class extends WrappedJsx {

    init(props) {
        super.init(ProgressBar, props);
        this.view = {
            classes: ['progress-bar-container', 'body-block']
        };
    }

}
