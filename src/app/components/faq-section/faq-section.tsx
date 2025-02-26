import React from 'react';
import AccordionGroup from '~/components/accordion-group/accordion-group';

export default function FAQ({
    heading,
    items
}: {
    heading: string;
    items: Parameters<typeof AccordionGroup>[0]['items'];
}) {
    return (
        <div className="boxed">
            <h1>{heading}</h1>
            <div className="articles">
                <AccordionGroup items={items} noScroll />
            </div>
        </div>
    );
}
