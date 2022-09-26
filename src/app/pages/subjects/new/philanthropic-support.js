import React from 'react';
import useSubjectsContext from './context';
import {linkClickTracker} from '~/helpers/savings-blurb';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './philanthropic-support.scss';

const eventName = 'Microdonation subjects page bottom sentence impact link';

export default function PhilanthropicSupport() {
    const {philanthropicSupport: savingsBlurb} = useSubjectsContext();

    return (
        <section className="philanthropic-support">
            <div className="content">
                <div className="text-content" onClick={linkClickTracker(eventName)}>
                    <RawHTML Tag="p" className="savings-blurb" html={savingsBlurb} />
                </div>
            </div>
        </section>
    );
}
