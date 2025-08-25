// Values come from https://openstax.org/apps/cms/api/webview-settings/
export type WindowWithSettings = typeof window & {
    SETTINGS: {
        accountHref: string;
        gatedContentEndpoint: string;
        renewalEndpoint: string;
        mapboxPK: string;
    };
};

export default function settings() {
    return (window as WindowWithSettings).SETTINGS;
}
