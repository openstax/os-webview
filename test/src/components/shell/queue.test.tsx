import React from 'react';
import {render} from '@testing-library/preact';
import useMSQueue from '~/layouts/default/microsurvey-popup/queue';

function Component() {
    const [QueuedItem, nextItem] = useMSQueue();

    if (!QueuedItem) {
        return null;
    }

    return <QueuedItem onDone={nextItem} />;
}

describe('microsurvey queue', () => {
    it('enqueues sticky and adoption content', async () => {
        render(<Component />);
    });
});
