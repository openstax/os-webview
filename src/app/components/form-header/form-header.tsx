import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import useLanguageContext from '~/contexts/language';
import useUserContext from '~/contexts/user';

import './form-header.scss';

function interpolateTags(template: string, replacements: Record<string, string>) {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => replacements[key] ?? '');
}

type UserStatus = ReturnType<typeof useUserContext>['userStatus'];

function pickField(
    data: Record<string, string>,
    prefix: string,
    suffix: string,
    isLoggedIn: boolean
) {
    const override = isLoggedIn ? data[`${prefix}LoggedIn${suffix}`] : '';

    return override || data[`${prefix}${suffix}`] || '';
}

/* eslint-disable camelcase */
function buildReplacements(userStatus: UserStatus | undefined) {
    const status = userStatus ?? ({} as Partial<UserStatus>);

    return {
        first_name: status.firstName || '',
        last_name: status.lastName || '',
        school: status.school || ''
    };
}
/* eslint-enable camelcase */

function FormHeader({
    data,
    prefix
}: {
    data: Record<string, string>;
    prefix: string;
}) {
    const {userStatus, isLoggedIn} = useUserContext();
    const heading = pickField(data, prefix, 'IntroHeading', isLoggedIn);
    const description = pickField(data, prefix, 'IntroDescription', isLoggedIn);
    const replacements = React.useMemo(() => buildReplacements(userStatus), [userStatus]);

    return (
        <div className="form-header">
            <div className="text-content subhead">
                <h1>{interpolateTags(heading, replacements)}</h1>
                <RawHTML Tag="span" html={interpolateTags(description, replacements)} />
            </div>
        </div>
    );
}

const slugBase = 'pages/form-headings';

export default function FormHeaderLoader({prefix}: {prefix: string}) {
    const {language} = useLanguageContext();
    const slug = `${slugBase}?locale=${language}`;

    return <LoaderPage slug={slug} Child={FormHeader} props={{prefix}} />;
}
