import React from 'react';
import {render, screen} from '@testing-library/preact';
import BookDetailsLoader from './book-details-context';
import {MemoryRouter} from 'react-router-dom';
import ResourceBoxes from '~/pages/details/common/resource-box/resource-boxes';
import {
    instructorResourceBoxPermissions,
    studentResourceBoxPermissions
} from '~/pages/details/common/resource-box/resource-box';

// Test all the conditions in here:
// userStatus: isInstructor: true|false
// userStatus: pending_verification: true|false
// resourceStatus: isExternal: true|false
// resourceData: link_text, link_external, link_document_url

const resourceData = {
    resource: {resourceUnlocked: true},
    linkText: 'Click this',
    lockedText: 'Login to unlock',
    linkDocument: {file: '/download'}
};
const userStatus = {
    isInstructor: false
};
const payload = {
    heading: 'This is the heading',
    description: 'This is <b>a description</b> in HTML',
}

function LangWrapResourceBoxes({models}) {
    // console.info('*** MODELS', models);
    return (
        <MemoryRouter initialEntries={['/details/books/sometitle?Instructor%20resources']}>
            <BookDetailsLoader slug='books/college-algebra'>
                <ResourceBoxes models={models} />
            </BookDetailsLoader>
        </MemoryRouter>
    )
}

function instructorModels(resDelta, userDelta={}) {
    const res = Object.assign({}, resourceData, resDelta);
    const user = Object.assign({}, userStatus, userDelta);

    return [
        Object.assign(payload, instructorResourceBoxPermissions(
            res, user, 'Instructor resources'
        ))
    ];
}

function studentModels(resDelta, userDelta={}) {
    const res = Object.assign({}, resourceData, resDelta);
    const user = Object.assign({}, userStatus, userDelta);

    return [
        Object.assign(payload, studentResourceBoxPermissions(
            res, user, 'Student resource'
        ))
    ];
}

test('handles unlocked instructor resources', async () => {
    render(<LangWrapResourceBoxes models={instructorModels({})} />);
    expect((await screen.findByRole('heading')).textContent).toBe(payload.heading);
    expect(screen.getAllByText('a description')).toHaveLength(1);
    expect(screen.getByRole('link').textContent).toBe(resourceData.linkText);
});

test('handles locked instructor resources', async () => {
    render(<LangWrapResourceBoxes models={instructorModels({resource: {resourceUnlocked: false}})} />);
    expect((await screen.findByRole('link')).textContent).toBe(resourceData.lockedText);
});

test('allows instructors access to locked resources', async () => {
    const models = instructorModels(
        {resource: {resourceUnlocked: false}},
        {isInstructor: true}
    );

    render(<LangWrapResourceBoxes models={models} />);
    expect((await screen.findByRole('link')).textContent).toBe(resourceData.linkText);
});

test('handles locked student resources', async () => {
    const models = studentModels(
        {resource: {resourceUnlocked: false}},
        {isStudent: false, isInstructor: false}
    );

    render(<LangWrapResourceBoxes models={models} />);
    expect((await screen.findByRole('link')).textContent).toBe(resourceData.lockedText);
});

test('allows students access to locked resources', async () => {
    const models = studentModels(
        {},
        {
            isStudent: true,
            isInstructor: false
        }
    );

    render(<LangWrapResourceBoxes models={models} />);
    expect((await screen.findByRole('link')).textContent).toBe(resourceData.linkText);
});

test('allows instructors access to locked student resources', async () => {
    const models = studentModels({
    },
    {
        isStudent: false,
        isInstructor: true
    });

    render(<LangWrapResourceBoxes models={models} />);
    const link = await screen.findByRole('link');

    expect(link.textContent).toBe(resourceData.linkText);
    expect(link.href).toMatch('/download');
});

test('understands external links', async () => {
    const models = studentModels({
        linkDocumentUrl: null,
        linkExternal: 'http://example.com/external_link'
    },
    {
        isStudent: false,
        isInstructor: true
    });

    render(<LangWrapResourceBoxes models={models} />);
    expect((await screen.findByRole('link')).textContent).toBe(resourceData.linkText);
});
