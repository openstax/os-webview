import React from 'react';

export default function TrackingParameters({source='OS Web'}) {
    return (
        <React.Fragment>
            <input type="hidden" name="application_source" value={source} />
            <input type="hidden" name="tracking_parameters" value={window.location.href} />
        </React.Fragment>
    );
}
