import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import RawHTML from '~/components/jsx-helpers/raw-html';

describe('raw-html', () => {
    it('activates scripts', () => {
        const html1 = '<script>const a = 1;</script>';
        const html2 = '<script src="something" />';
        const html3 = '<div><b>hi</b></div>';
        const {baseElement} = render(
            <div>
                <RawHTML html={html1} embed />
                <RawHTML html={html2} embed />
                <RawHTML html={html3} />
            </div>
        );

        expect(baseElement).toMatchInlineSnapshot(`
            <body>
              <div>
                <div>
                  <div>
                    <script>
                      const a = 1;
                    </script>
                  </div>
                  <div>
                    <script
                      src="something"
                    />
                  </div>
                  <div>
                    <div>
                      <b>
                        hi
                      </b>
                    </div>
                  </div>
                </div>
              </div>
            </body>
        `);
    });
});
