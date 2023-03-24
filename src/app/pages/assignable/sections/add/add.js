import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './add.scss';

export default function Add({data}) {
    return (
        <section className="results near-white">
            <div className="content-block">
                <div>
                    <h2>{data.addAssignableHeader}</h2>
                    <div>{data.addAssignableDescription}</div>
                </div>
                <RawHTML html={data.addAssignableHtml} />
            </div>
        </section>
    );
}
