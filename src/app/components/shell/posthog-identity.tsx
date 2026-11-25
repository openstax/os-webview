import React from 'react';
import useUserContext from '~/contexts/user';
import usePersonalization, {PersonalizationData} from '~/contexts/personalization';
import {whenPostHogLoads} from '~/helpers/posthog';

// School arrives only with the sfapi response; a sessionStorage hydration lacks
// it, and sending null then would clear the person's school in PostHog.
function personProperties(data: PersonalizationData) {
    return {
        audience: data.audience,
        segments: data.segments,
        ...(data.school === undefined ? {} : {school: data.school?.name ?? null})
    };
}

// Names and books stay out of PostHog; see the Personalization notes in CLAUDE.md.
export default function PostHogIdentity() {
    const {uuid} = useUserContext();
    const {status, data} = usePersonalization();
    const identifiedAs = React.useRef<string | undefined>(undefined);

    React.useEffect(() => {
        if (!uuid) {
            if (!identifiedAs.current) {
                return undefined;
            }
            identifiedAs.current = undefined;
            return whenPostHogLoads((posthog) => posthog.reset());
        }
        const properties = status === 'ready' && data ? personProperties(data) : undefined;

        return whenPostHogLoads((posthog) => {
            if (identifiedAs.current !== uuid) {
                posthog.identify(uuid);
                identifiedAs.current = uuid;
            }
            if (properties) {
                posthog.setPersonProperties(properties);
            }
        });
    }, [uuid, status, data]);

    return null;
}
