import React from 'react';
import useSubjectsContext from './context';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './philanthropic-support.scss';

export default function PhilanthropicSupport() {
    const {philanthropicSupport: savingsBlurb} = useSubjectsContext();

    return (
        <section className="philanthropic-support">
            <div className="content">
                <div className="text-content">
                    <RawHTML Tag="p" className="savings-blurb" html={savingsBlurb} />
                </div>
            </div>
        </section>
    );
}
