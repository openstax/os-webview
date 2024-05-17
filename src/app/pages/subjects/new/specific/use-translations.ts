import useSpecificSubjectContext from './context';

export default function useTranslations() {
    const ctx = useSpecificSubjectContext();

    if (!(ctx?.translations instanceof Array)) {
        return null;
    }
    const {translations: [translations]} = ctx;

    return translations;
}
