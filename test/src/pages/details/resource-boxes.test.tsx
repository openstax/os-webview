import React from 'react';
import {render, screen} from '@testing-library/preact';
import BookDetailsLoader from './book-details-context';
import * as detailCtx from '~/pages/details/context';
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
    description: 'This is <b>a description</b> in HTML'
};

function LangWrapResourceBoxes({
    models, includeCommonsHub
}: {
    models: Parameters<typeof ResourceBoxes>[0]['models'];
    includeCommonsHub?: boolean;
}) {
    return (
        <BookDetailsLoader slug="books/college-algebra">
            <ResourceBoxes models={models} includeCommonsHub={includeCommonsHub} />
        </BookDetailsLoader>
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
    ];
}

function studentModels(resDelta: ResDelta, userDelta = {}) {
    const res = Object.assign({}, resourceData, resDelta);
    const user = Object.assign({}, userStatus, userDelta);

    return [Object.assign(payload, studentResourceBoxPermissions(res, user))];
}

it('handles unlocked instructor resources', async () => {
    render(<LangWrapResourceBoxes models={instructorModels({})} />);
    expect((await screen.findByRole('heading')).textContent).toBe(
        payload.heading
    );
    expect(screen.getAllByText('a description')).toHaveLength(1);
    expect(screen.getByRole('link').textContent).toBe(resourceData.linkText);
});

it('handles locked instructor resources', async () => {
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

    const links = await screen.findAllByRole<HTMLAnchorElement>('link');

    expect(links.find((el) => el.textContent === resourceData.lockedText)).toBeTruthy();
    expect(links).toHaveLength(3);
});
it('handles empty community resource url', async () => {
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
    const links = await screen.findAllByRole<HTMLAnchorElement>('link');

    expect(links).toHaveLength(1);
});

it('allows instructors access to locked resources', async () => {
    const models = instructorModels(
        {resource: {resourceUnlocked: false}},
        {isInstructor: true}
    );

    render(<LangWrapResourceBoxes models={models} />);
    expect((await screen.findByRole('link')).textContent).toBe(
        resourceData.linkText
    );
});

it('handles locked student resources', async () => {
    const models = studentModels(
        {resource: {resourceUnlocked: false}},
        {isStudent: false, isInstructor: false}
    );

    render(<LangWrapResourceBoxes models={models} />);
    expect((await screen.findByRole('link')).textContent).toBe(
        resourceData.lockedText
    );
});

it('allows students access to locked resources', async () => {
    const models = studentModels(
        {},
        {
            isStudent: true,
            isInstructor: false
        }
    );

    render(<LangWrapResourceBoxes models={models} />);
    expect((await screen.findByRole('link')).textContent).toBe(
        resourceData.linkText
    );
});

it('allows instructors access to locked student resources', async () => {
    const models = studentModels(
        {},
        {
            isStudent: false,
            isInstructor: true
        }
    );

    render(<LangWrapResourceBoxes models={models} />);
    const link = await screen.findByRole<HTMLAnchorElement>('link');

    expect(link.textContent).toBe(resourceData.linkText);
    expect(link.href).toMatch('/download');
});

it('understands external links', async () => {
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
    expect((await screen.findByRole('link')).textContent).toBe(
        resourceData.linkText
    );
});
