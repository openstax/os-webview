import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons/faCheck';
import useSubscriptions from '~/pages/my-openstax/store/use-subscriptions';
import './email-prefs.scss';

function Checkbox({ item }) {
    const {add, remove} = useSubscriptions();
    const label = item.title;
    const checked = item.subscribed;
    const id = `${label}-label`;

    function toggle() {
        const action = checked ? remove: add;

        action(item);
    }
    function toggleByKey(event) {
        if (['Enter', ' '].includes(event.key)) {
            toggle();
            event.preventDefault();
        }
    }

    return (
        <div className='labeled-checkbox'>
            <span
                className='checkbox' role='checkbox' aria-checked={checked}
                tabIndex='0' aria-labelledby={id} onClick={toggle}
                onKeyDown={toggleByKey}
            >
                {
                    checked &&
                    <FontAwesomeIcon icon={faCheck} />
                }
            </span>
            <label id={id}>
                {label}
                <br />
                <span className="description">{item.description}</span>
            </label>
        </div>
    );
}

export default function EmailPrefs() {
    const {lists} = useSubscriptions();

    return (
        <section id='email-prefs'>
            <h2>Email Preferences</h2>
            <section>
                <h3>Updates</h3>
                {
                    lists.map((item) =>
                        <Checkbox item={item} key={item.pardotId} />
                    )
                }
            </section>
        </section>
    );
}
