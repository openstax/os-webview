import React from 'react';

export default function ChildrenContainer({children}: React.PropsWithChildren<object>) {
    return <div>{children}</div>;
}
