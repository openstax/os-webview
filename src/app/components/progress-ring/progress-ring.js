import React, {useState} from 'react';
import './progress-ring.css';

export default function ProgressRing({message, radius, progress, stroke}) {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const rotation = -90;
    const strokeDashoffset = circumference - progress / 100 * circumference;

    return (
        <div className="progress-ring">
            <div className="message">
                {message} min read
            </div>
            <svg height={radius * 2} width={radius * 2}>
                <circle className="unfinished"
                    cx={radius}
                    cy={radius}
                    fill="transparent"
                    r={normalizedRadius}
                    stroke-dasharray={`${circumference} ${circumference}`}
                    stroke-width={stroke}
                    style="stroke-dashoffset: 0"
                />
                <circle className="finished"
                    cx={radius}
                    cy={radius}
                    fill="transparent"
                    r={normalizedRadius}
                    stroke-dasharray={`${circumference} ${circumference}`}
                    stroke-width={stroke}
                    style={`stroke-dashoffset: ${strokeDashoffset}`}
                />
            </svg>
        </div>
    );
}
