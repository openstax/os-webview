import React from 'react';
import { LocaleEntry } from '~/components/language-selector/language-selector';

type SpecificSubjectPageData = {
    translations?: [LocaleEntry[]];
};

export default function (): SpecificSubjectPageData;

type ProviderArgs = {
    contextValueParameters: string;
};
export function SpecificSubjectContextProvider(
    args: React.PropsWithChildren<ProviderArgs>
): React.ReactNode;
