export type WindowWithSettings = typeof window & {
    SETTINGS: {
        accountHref: string;
        gatedContentEndpoint: string;
    };
};

export default function settings() {
    return (window as WindowWithSettings).SETTINGS;
}
