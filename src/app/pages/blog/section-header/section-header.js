import React from 'react';
import './section-header.scss';

export default function SectionHeader({head, subhead}) {
    return (
        <h2 className="section-header">
            {head}
            {subhead && <span className="section-subhead">{subhead}</span>}
        </h2>
    );
}
