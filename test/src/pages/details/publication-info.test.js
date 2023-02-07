import React from 'react';
import {render, screen} from '@testing-library/preact';
import useDetailsContext from '~/pages/details/context';
import PublicationInfo from '~/pages/details/common/publication-info';
import BookDetailsLoader from './book-details-context';

function WrappedPublicationInfo({additionalItems={}}) {
    const model = {...useDetailsContext(), ...additionalItems};

    return (
        <PublicationInfo model={model} url="/some/path" />
    );
}

test('Shows publication dates', async () => {
    render(
        <BookDetailsLoader slug="books/college-algebra">
            <WrappedPublicationInfo />
        </BookDetailsLoader>
    );
    await screen.findByText('Publish Date:');
    expect(screen.getByText('Hardcover:'));
    expect(screen.getByText('Paperback:'));
    expect(screen.queryAllByText('iBooks', {exact: false})).toHaveLength(0);
});

test('Shows iBooks publication dates when present', async () => {
    const additionalItems = {
        ibookIsbn10: 'fakeISBN1',
        ibookVolume2Isbn10: 'fakeISBN2'
    };

    render(
        <BookDetailsLoader slug="books/college-algebra">
            <WrappedPublicationInfo additionalItems={additionalItems} />
        </BookDetailsLoader>
    );
    await screen.findByText('Publish Date:');
    expect(screen.queryAllByText('iBooks', {exact: false})).toHaveLength(2);
});
