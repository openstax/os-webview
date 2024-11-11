import React from 'react';
import {render, screen} from '@testing-library/preact';
import ShellContextProvider from '../../../helpers/shell-context';
import {MemoryRouter} from 'react-router-dom';

import * as detailCtx from '~/pages/details/context';
import ResourceBoxes, {ResourceModel} from '~/pages/details/common/resource-box/resource-boxes';
import {
    instructorResourceBoxPermissions,
    studentResourceBoxPermissions,
    ResourceData
} from '~/pages/details/common/resource-box/resource-box-utils';
import type {UserStatus} from '~/contexts/user';

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
} as ResourceData;
const userStatus = {
    isInstructor: false
} as UserStatus;
const payload = {
    heading: 'This is the heading',
    description: 'This is <b>a description</b> in HTML'
};

function LangWrapResourceBoxes({
    models,
    includeCommonsHub
}: {
    models: Parameters<typeof ResourceBoxes>[0]['models'];
    includeCommonsHub?: boolean;
}) {
    return (
        <ShellContextProvider>
            <MemoryRouter initialEntries={['/books/college-algebra']}>
                <ResourceBoxes
                    models={models}
                    includeCommonsHub={includeCommonsHub}
                />
            </MemoryRouter>
        </ShellContextProvider>
    );
}

type ResDelta = Partial<{
    resource: {resourceUnlocked: boolean};
    isInstructor: boolean;
    linkDocumentUrl: string | null;
    linkExternal: string;
}>;
function instructorModels(resDelta: ResDelta, userDelta: ResDelta = {}) {
    const res = Object.assign({}, resourceData, resDelta);
    const user = Object.assign({}, userStatus, userDelta);

    return [
        Object.assign(
            payload,
            instructorResourceBoxPermissions(res, user, 'Instructor resources')
        )
    ] as [ResourceModel];
}

function studentModels(resDelta: ResDelta, userDelta = {}) {
    const res = Object.assign({}, resourceData, resDelta);
    const user = Object.assign({}, userStatus, userDelta);

    return [Object.assign(payload, studentResourceBoxPermissions(res, user))] as [ResourceModel];
}

it('handles unlocked instructor resources', () => {
    render(<LangWrapResourceBoxes models={instructorModels({})} />);
    expect(screen.getByRole('heading').textContent).toBe(payload.heading);
    expect(screen.getAllByText('a description')).toHaveLength(1);
    expect(screen.getByRole('link').textContent).toBe(resourceData.linkText);
});

it('handles locked instructor resources', () => {
    const mockUseDetailsContext = jest.spyOn(detailCtx, 'default');

    mockUseDetailsContext.mockReturnValueOnce({
        communityResourceHeading: 'cr-head',
        communityResourceUrl: 'cr-url',
        communityResourceLogoUrl: '',
        communityResourceBlurb: 'cr-blurb',
        communityResourceCta: 'cr-cta',
        communityResourceFeatureLinkUrl: 'cr-feature-url',
        communityResourceFeatureText: ''
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    render(
        <LangWrapResourceBoxes
            models={instructorModels({resource: {resourceUnlocked: false}})}
            includeCommonsHub
        />
    );

    const links = screen.getAllByRole<HTMLAnchorElement>('link');

    expect(
        links.find((el) => el.textContent === resourceData.lockedText)
    ).toBeTruthy();
    expect(links).toHaveLength(3);
});
it('handles empty community resource url', () => {
    const mockUseDetailsContext = jest.spyOn(detailCtx, 'default');

    mockUseDetailsContext.mockReturnValueOnce({
        communityResourceUrl: ''
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    render(
        <LangWrapResourceBoxes
            models={instructorModels({resource: {resourceUnlocked: false}})}
            includeCommonsHub
        />
    );
    const links = screen.getAllByRole<HTMLAnchorElement>('link');

    expect(links).toHaveLength(1);
});

it('allows instructors access to locked resources', () => {
    const models = instructorModels(
        {resource: {resourceUnlocked: false}},
        {isInstructor: true}
    );

    render(<LangWrapResourceBoxes models={models} />);
    expect(screen.getByRole('link').textContent).toBe(resourceData.linkText);
});

it('handles locked student resources', () => {
    const models = studentModels(
        {resource: {resourceUnlocked: false}},
        {isStudent: false, isInstructor: false}
    );

    render(<LangWrapResourceBoxes models={models} />);
    expect(screen.getByRole('link').textContent).toBe(resourceData.lockedText);
});

it('allows students access to locked resources', () => {
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

it('allows instructors access to locked student resources', () => {
    const models = studentModels(
        {},
        {
            isStudent: false,
            isInstructor: true
        }
    );

    render(<LangWrapResourceBoxes models={models} />);
    const link = screen.getByRole<HTMLAnchorElement>('link');

    expect(link.textContent).toBe(resourceData.linkText);
    expect(link.href).toMatch('/download');
});

it('understands external links', () => {
    const models = studentModels(
        {
            linkDocumentUrl: null,
            linkExternal: 'http://example.com/external_link'
        },
        {
            isStudent: false,
            isInstructor: true
        }
    );

    render(<LangWrapResourceBoxes models={models} />);
    expect(screen.getByRole('link').textContent).toBe(resourceData.linkText);
});

it('displays comingSoonText and NewLabel', () => {
    const models = studentModels({}, {}).map((model) => ({
        ...model,
        comingSoon: true,
        comingSoonText: 'not ready yet!',
        isNew: true
    }));

    render(<LangWrapResourceBoxes models={models} />);
    screen.getByText('not ready yet!');
});

it('displays k12 badge', () => {
    const models = studentModels({}, {}).map((model) => ({
        ...model,
        k12: true,
        comingSoonText: 'not ready yet!'
    }));

    render(<LangWrapResourceBoxes models={models} />);
    screen.getByAltText('K12 resource');
    expect(screen.getByRole('heading', {level: 3}).getAttribute('class')).toBe(
        'space-for-badge'
    );
});

it('displays CreatorFest notice', () => {
    const models = studentModels({}, {}).map((model) => ({
        ...model,
        creatorFest: true
    }));

    render(<LangWrapResourceBoxes models={models} />);
    screen.getByRole('img', {
        description: 'This resource was created by instructors at Creator Fest'
    });
});

it('displays print link', () => {
    const models = studentModels({}, {}).map((model) => ({
        ...model,
        printLink: '/path/to/print'
    }));

    render(<LangWrapResourceBoxes models={models} />);
    screen.getByRole('link', {name: 'Buy print'});
});

it('displays NEW label', () => {
    const models = studentModels({}, {}).map((model) => ({
        ...model,
        isNew: true
    }));

    render(<LangWrapResourceBoxes models={models} />);
    screen.getByText('NEW');
});
