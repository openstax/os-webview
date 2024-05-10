import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render} from '@testing-library/preact';
import ContentGroup from '~/components/content-group/content-group';

describe('content-group', () => {
    it('renders', () => {
        const {baseElement} = render(
            <ContentGroup activeIndex={1} labels={['a', 'b', 'c']}>
                <div>one</div>
                <div>two</div>
                <div>three</div>
            </ContentGroup>
        );

        expect(baseElement).toMatchInlineSnapshot(`
            <body>
              <div>
                <div
                  class="content-group"
                >
                  <div
                    aria-labelledby="a-tab"
                    hidden=""
                    id="a-panel"
                    role="tabpanel"
                  >
                    <div>
                      one
                    </div>
                  </div>
                  <div
                    aria-labelledby="b-tab"
                    id="b-panel"
                    role="tabpanel"
                  >
                    <div>
                      two
                    </div>
                  </div>
                  <div
                    aria-labelledby="c-tab"
                    hidden=""
                    id="c-panel"
                    role="tabpanel"
                  >
                    <div>
                      three
                    </div>
                  </div>
                </div>
              </div>
            </body>
        `);
    });
});
