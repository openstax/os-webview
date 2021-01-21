import React, {useEffect} from 'react';

export default function ContentGroup({activeIndex, children}) {
    return (
        <div className="content-group">
            {
                React.Children.map(children, (child, i) =>
                    <div hidden={activeIndex !== i} key={i}>
                        {child}
                    </div>
                )
            }
        </div>
    );
}
