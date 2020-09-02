import React, {useEffect} from 'react';

export default function ContentGroup({activeIndex, children}) {
    return (
        <div className="content-group">
            {
                children.map((child, i) =>
                    <div hidden={activeIndex !== i} key={i}>
                        {child}
                    </div>
                )
            }
        </div>
    );
}
