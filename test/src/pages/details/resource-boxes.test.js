import React from 'react';
import {render, screen} from '@testing-library/preact';
import {UserContextProvider} from '~/contexts/user';
import {LanguageContextProvider} from '~/contexts/language';
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

function LangWrapResourceBoxes({...args}) {
    return (
        <UserContextProvider>
            <LanguageContextProvider>
                <ResourceBoxes {...args} />
            </LanguageContextProvider>
        </UserContextProvider>
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

test('handles unlocked instructor resources', () => {
    render(<LangWrapResourceBoxes models={instructorModels({})} />);
    expect(screen.getByRole('heading').textContent).toBe(payload.heading);
    expect(screen.getAllByText('a description')).toHaveLength(1);
    expect(screen.getByRole('link').textContent).toBe(resourceData.linkText);
});

test('handles locked instructor resources', () => {
    render(<LangWrapResourceBoxes models={instructorModels({resourceUnlocked: false})} />);

    expect(screen.getByRole('link').textContent).toBe('Login to unlock');
});

test('allows instructors access to locked resources', () => {
    const models = instructorModels(
        {resourceUnlocked: false},
        {isInstructor: true}
    );

    render(<LangWrapResourceBoxes models={models} />);
    expect(screen.getByRole('link').textContent).toBe(resourceData.linkText);
});

test('handles locked student resources', () => {
    const models = studentModels(
        {resourceUnlocked: false},
        {isStudent: false, isInstructor: false}
    );

    render(<LangWrapResourceBoxes models={models} />);
    expect(screen.getByRole('link').textContent).toBe('Login to unlock');
});

test('allows students access to locked resources', () => {
    const models = studentModels(
        {},
        {
            isStudent: true,
            isInstructor: false
        }
    );

    render(<LangWrapResourceBoxes models={models} />);
    expect(screen.getByRole('link').textContent).toBe(resourceData.linkText);
});

test('allows instructors access to locked student resources', () => {
    const models = studentModels({
    },
    {
        isStudent: false,
        isInstructor: true
    });

    render(<LangWrapResourceBoxes models={models} />);
    const link = screen.getByRole('link');
    expect(link.textContent).toBe(resourceData.linkText);
    expect(link.querySelector('.fa-download')).toBeTruthy();
});

test('understands external links', () => {
    const models = studentModels({
        linkDocumentUrl: null,
        linkExternal: 'http://example.com/external_link'
    },
    {
        isStudent: false,
        isInstructor: true
    });

    render(<LangWrapResourceBoxes models={models} />);
    const link = screen.getByRole('link');
    expect(link.textContent).toBe(resourceData.linkText);
    expect(link.querySelector('.fa-external-link-alt')).toBeTruthy();
});
