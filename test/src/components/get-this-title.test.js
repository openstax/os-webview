import GetThisTitle from '~/components/get-this-title/get-this-title';
import {clickElement} from '../../test-utils';
import shellBus from '~/components/shell/shell-bus';
// Biology book details
import details from '../data/details';

describe('GetThisTitle', () => {
    const p = new GetThisTitle(details);

    it('initializes', () => {
        expect(p).toBeTruthy();
    });

    it('hides bulk orders', () => {
        const boLink = p.el.querySelector('a[href^="/bulk-order"]');

        expect(boLink).toBeNull();
    });

    it('shows links', () => {
        for (const url of [details.webview_link, details.ibook_link]) {
            const link = p.el.querySelector(`[href="${url}"]`);

            expect(link).toBeTruthy();
        }
    });
    it('handles Print Copy dialog', () => {
        const pcLink = p.el.querySelector('.show-print-submenu');
        const showed = new Promise((resolve) => {
            shellBus.on('showDialog', resolve);
        });

        clickElement(pcLink);
        return showed;
    });
});
