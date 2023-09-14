import useSpecificSubjectContext from './context';

export default function useTranslations() {
    const ctx = useSpecificSubjectContext();

    if (!ctx?.translations) {
        return null;
    }
    const {translations: [translations]} = ctx;

    return translations;
}
