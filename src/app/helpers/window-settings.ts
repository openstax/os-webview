type WindowWithSettings = typeof window & {
    SETTINGS: {
        accountHref: string;
        gatedContentEndpoint: string;
    };
};

export default window as WindowWithSettings;
