import React from 'react';
import './list-of-links.scss';

export default function ListOfLinks({children}: React.PropsWithChildren<object>) {
    return (
        <ul className="list-of-links">
            {React.Children.toArray(children).map((c, i) => (<li key={i}>{c}</li>))}
        </ul>
    );
}
