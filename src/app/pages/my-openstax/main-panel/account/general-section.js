import React, { useState } from 'react';
import { LoadingSection, TextInput } from '../common';
import { useStoreon } from 'storeon/preact';

function AccountTextInput({ info }) {
    const { label, value, onChange } = info;

    return (
        <TextInput label={label} value={value} onChange={onChange} />
    );
}

function useInfoItem({ label, storeTag }) {
    const { account: store } = useStoreon('account');
    const storeValue = store[storeTag];
    const [value, updateValue] = useState(storeValue);

    function onChange(event) {
        updateValue(event.target.value);
    }

    return {
        label,
        value,
        storeTag,
        storeValue,
        onChange
    };
}

function infoItemsToStoreData(infoItems) {
    return infoItems.reduce((a, item) => {
        a[item.storeTag] = item.value;
        return a;
    }, {});
}

function GeneralSectionWhenReady() {
    const { dispatch, account: store } = useStoreon('account');

    const infoItems = [
        {
            label: 'First name',
            storeTag: 'firstName'
        },
        {
            label: 'Last name',
            storeTag: 'lastName'
        },
        {
            label: 'username',
            storeTag: 'username'
        }
    ].map(useInfoItem);

    function isDirty() {
        const result = infoItems.some((item) => item.value !== item.storeValue);

        if (store.message && result) {
            dispatch('account/reset-message');
        }

        return result;
    }

    function allHaveValues() {
        return !infoItems.some((item) => item.value === '');
    }

    function canSave() {
        return isDirty() && allHaveValues();
    }

    function save(event) {
        dispatch('account/save', infoItemsToStoreData(infoItems));
        event.preventDefault();
    }

    return (
        <React.Fragment>
            <div className='fields general-fields'>
                {
                    infoItems.map((info) =>
                        <AccountTextInput info={info} key={info.label} />
                    )
                }
            </div>
            <div className='button-and-message'>
                <button type='submit' disabled={!canSave()} onClick={save}>Save</button>
                <div className='message'>{store.message}</div>
            </div>
        </React.Fragment>
    );
}

export default function GeneralSection() {
    const { account: store } = useStoreon('account');

    return (
        <section>
            <h3>General</h3>
            {
                store.ready ?
                    <GeneralSectionWhenReady /> :
                    <LoadingSection />
            }
        </section>
    );
}
