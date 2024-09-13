import React from 'react';

jest.mock('react-lazyload', () => ({
    __esModule: true,
    default: ({children}: React.PropsWithChildren<object>) => {
        return (
            <div>{children}</div>
        );
    }
}));
