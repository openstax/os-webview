import type {LocaleEntry} from '~/components/language-selector/language-selector';

type PageData = {
    error?: string;
    translations: [Array<LocaleEntry>];
};

export default function usePageData(
    slug: string,
    preserveWrapping?: boolean,
    noCamelCase?: boolean
): PageData;
