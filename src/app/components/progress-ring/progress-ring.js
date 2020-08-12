import React, {useState} from 'react';
import './progress-ring.css';

function Circle({basicProps, className, style}) {
    return (
        <circle
            {...basicProps}
            className={className}
            style={style}
        />
    );
}

export default function ProgressRing({message, radius, progress, stroke}) {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const basicCircleProps = {
        cx: radius,
        cy: radius,
        fill: 'transparent',
        r: normalizedRadius,
        strokeDashArray: `${circumference} ${circumference}`,
        strokeWidth: stroke
    };
    const strokeDashoffset = circumference - progress / 100 * circumference;

    return (
        <div className="progress-ring">
            <div className="message">
                {message} min read
            </div>
            <svg height={radius * 2} width={radius * 2}>
                <Circle
                    basicProps={basicCircleProps}
                    className="unfinished"
                    style="stroke-dashoffset: 0" />
                <Circle
                    basicProps={basicCircleProps}
                    className="finished"
                    style={`stroke-dashoffset: ${strokeDashoffset}`} />
            </svg>
        </div>
    );
}
