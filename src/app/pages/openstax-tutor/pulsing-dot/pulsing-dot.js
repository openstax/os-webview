import React, {useState} from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import cn from 'classnames';
import './pulsing-dot.css';

export default function PulsingDot({html}) {
    const [pulsing, setPulsing] = useState(true);

    return (
        <div className="pulsing-dot" onClick={() => setPulsing(false)}>
            <div className={cn('dot', {stopped: !pulsing})} />
            <div className="pulse">!</div>
            <RawHTML className="popup" html={html} />
        </div>
    );
}
