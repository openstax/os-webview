import React from 'react';
import './progress-ring.scss';

export default function ProgressRing({message, radius, progress, stroke}: {
    message?: number;
    radius: number;
    progress: number;
    stroke: number;
}) {
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
                <circle
                    {...basicCircleProps}
                    className="unfinished" />
                <circle
                    {...basicCircleProps}
                    className="finished"
                    strokeDashoffset={strokeDashoffset} />
            </svg>
        </div>
    );
}
