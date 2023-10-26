import React from 'react';

export type LocaleEntry = {
    locale: string;
    slug: string;
};

type LinkPresentationType = ({locale}: LocaleEntry) => React.JSX.Element | null;

type LanguageSelectorArgs = {
    LeadIn: () => React.JSX.Element;
    otherLocales: string[];
    LinkPresentation: LinkPresentationType;
};

export default function (args: LanguageSelectorArgs): React.ReactNode;

export const LanguageLink: LinkPresentationType;

export function LanguageText({locale}: Pick<LocaleEntry, 'locale'>): React.ReactNode;
