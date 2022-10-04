import React from 'react';
import './progress-ring.scss';

function Circle({basicProps, className, strokeDashoffset=0}) {
    return (
        <circle
            {...basicProps}
            className={className}
            strokeDashoffset={strokeDashoffset}
        />
    );
}

export default function ProgressRing({message, radius, progress, stroke}) {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const basicCircleProps = React.useMemo(
        () => {
            return ({
                cx: radius,
                cy: radius,
                fill: 'transparent',
                r: normalizedRadius,
                strokeDasharray: circumference,
                strokeWidth: stroke
            });
        },
        [radius, normalizedRadius, circumference, stroke]
    );
    const strokeDashoffset = circumference - progress / 100 * circumference;

    return (
        <div className="progress-ring">
            <div className="message">
                {message} min read
            </div>
            <svg height={radius * 2} width={radius * 2}>
                <Circle
                    basicProps={basicCircleProps}
                    className="unfinished" />
                <Circle
                    basicProps={basicCircleProps}
                    className="finished"
                    strokeDashoffset={strokeDashoffset} />
            </svg>
        </div>
    );
}
