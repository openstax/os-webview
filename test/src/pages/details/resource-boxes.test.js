import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {render, screen} from '@testing-library/preact';
import {UserContextProvider} from '~/contexts/user';
import {DetailsContextProvider} from '~/pages/details/context';
import ResourceBoxes from '~/pages/details/common/resource-box/resource-boxes';
import {instructorResourceBoxPermissions, studentResourceBoxPermissions} from '~/pages/details/common/resource-box/resource-box';

// Test all the conditions in here:
// userStatus: isInstructor: true|false
// userStatus: pending_verification: true|false
// resourceStatus: isExternal: true|false
// resourceData: link_text, link_external, link_document_url

const resourceData = {
    resourceUnlocked: true,
    linkText: 'Click this',
    linkDocumentUrl: '/download'
};
const userStatus = {
    isInstructor: false
};
const payload = {
    heading: 'This is the heading',
    description: 'This is <b>a description</b> in HTML',
}

function LangWrapResourceBoxes({models}) {
    return (
        <MemoryRouter initialEntries={["/details/books/college-algebra"]}>
            <UserContextProvider>
                <DetailsContextProvider>
                    <ResourceBoxes models={models} />
                </DetailsContextProvider>
            </UserContextProvider>
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

test('handles unlocked instructor resources', (done) => {
    render(<LangWrapResourceBoxes models={instructorModels({})} />);
    setTimeout(() => {
        expect(screen.getByRole('heading').textContent).toBe(payload.heading);
        expect(screen.getAllByText('a description')).toHaveLength(1);
        expect(screen.getByRole('link').textContent).toBe(resourceData.linkText);
        done();
    }, 0);
});

test('handles locked instructor resources', (done) => {
    render(<LangWrapResourceBoxes models={instructorModels({resourceUnlocked: false})} />);

    setTimeout(() => {
        expect(screen.getByRole('link').textContent).toBe('Login to unlock');
        done();
    }, 0);
});

test('allows instructors access to locked resources', (done) => {
    const models = instructorModels(
        {resourceUnlocked: false},
        {isInstructor: true}
    );

    render(<LangWrapResourceBoxes models={models} />);
    setTimeout(() => {
        expect(screen.getByRole('link').textContent).toBe(resourceData.linkText);
        done();
    }, 0);
});

test('handles locked student resources', (done) => {
    const models = studentModels(
        {resourceUnlocked: false},
        {isStudent: false, isInstructor: false}
    );

    render(<LangWrapResourceBoxes models={models} />);
    setTimeout(() => {
        expect(screen.getByRole('link').textContent).toBe('Login to unlock');
        done();
    }, 0);
});

test('allows students access to locked resources', (done) => {
    const models = studentModels(
        {},
        {
            isStudent: true,
            isInstructor: false
        }
    );

    render(<LangWrapResourceBoxes models={models} />);
    setTimeout(() => {
        expect(screen.getByRole('link').textContent).toBe(resourceData.linkText);
        done();
    }, 0);
});

test('allows instructors access to locked student resources', (done) => {
    const models = studentModels({
    },
    {
        isStudent: false,
        isInstructor: true
    });

    render(<LangWrapResourceBoxes models={models} />);
    setTimeout(() => {
        const link = screen.getByRole('link');
        expect(link.textContent).toBe(resourceData.linkText);
        expect(link.querySelector('.fa-download')).toBeTruthy();
        done();
    }, 0);
});

test('understands external links', (done) => {
    const models = studentModels({
        linkDocumentUrl: null,
        linkExternal: 'http://example.com/external_link'
    },
    {
        isStudent: false,
        isInstructor: true
    });

    render(<LangWrapResourceBoxes models={models} />);
    setTimeout(() => {
        const link = screen.getByRole('link');
        expect(link.textContent).toBe(resourceData.linkText);
        // expect(link.querySelector('.fa-external-link-alt')).toBeTruthy();
        done();
    }, 0);
});
