import React from 'react';
import {render} from '@testing-library/preact';
import useMSQueue from '~/layouts/default/microsurvey-popup/queue';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import * as S from '~/layouts/default/shared';
import * as AC from '~/layouts/default/microsurvey-popup/adoption-content';
import stickyData from '~/../../test/src/data/sticky-data';

function Component() {
    const [QueuedItem, nextItem] = useMSQueue();

    React.useEffect(() => {
        if (QueuedItem) {
            nextItem();
        }
    });

    if (!QueuedItem) {
        return null;
    }

    return <QueuedItem onDone={nextItem} />;
}

function MockAdoptionContent() {
    return <div>Adoption stuff</div>;
}

describe('microsurvey queue', () => {
    stickyData.mode = 'popup';
    jest.spyOn(S, 'useStickyData').mockReturnValue(stickyData);
    jest.spyOn(AC, 'default').mockReturnValue([true, MockAdoptionContent]);

    it('enqueues sticky and adoption content', async () => {
        render(<MemoryRouter initialEntries={['/']}>
            <Component />
        </MemoryRouter>);
        console.info('** Page', document.body.innerHTML);
    });
});
