import React from 'react';
import * as RCT from '~/components/recaptcha';

function Recaptcha({children}: React.PropsWithChildren<object>) {
    return children;
}

jest.spyOn(RCT, 'default').mockReturnValue({token: 'foo', Recaptcha});
