import React from 'react';
import {render, screen} from '@testing-library/preact';
import useMSQueue from '~/layouts/default/microsurvey-popup/queue';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import * as S from '~/layouts/default/shared';
import * as AC from '~/layouts/default/microsurvey-popup/adoption-content';
import stickyData from '~/../../test/src/data/sticky-data';

let itemsHandled = 0;

function Component() {
    const [QueuedItem, nextItem] = useMSQueue();

    React.useEffect(() => {
        if (QueuedItem) {
            ++itemsHandled;
            nextItem();
        }
    });

    if (!QueuedItem) {
        return <div>{itemsHandled} item handled</div>;
    }

    return <QueuedItem onDone={nextItem}><div /></QueuedItem>;
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
        screen.getByText('1 item handled');
    });
});
