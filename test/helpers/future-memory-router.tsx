import React from 'react';
import {MemoryRouter} from 'react-router-dom';

// @ts-expect-error does not exist on
const {routerFuture} = global;

export default function FutureMemoryRouter(props: Parameters<typeof MemoryRouter>[0]) {
    return <MemoryRouter {...props} future={routerFuture} />;
}
