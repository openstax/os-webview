import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';

export default function Quote({model}: {
    model: {
        content: string;
        attribution: string;
    }
}) {
    return (
        <div className='quote'>
            <blockquote>
                <RawHTML html={model.content} />
                {
                    Boolean(model.attribution) &&
                        <div className="attribution">— {model.attribution}</div>
                }
            </blockquote>
        </div>
    );
}
