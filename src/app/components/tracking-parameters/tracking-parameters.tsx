import React from 'react';

export default function TrackingParameters() {
    return (
        <React.Fragment>
            <input type="hidden" name="application_source" value="OS Web" />
            <input type="hidden" name="tracking_parameters" value={window.location.href} />
        </React.Fragment>
    );
}
