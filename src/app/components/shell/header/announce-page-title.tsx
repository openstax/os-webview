import React from 'react';

export default function announcePageTitle(title: string) {
    const el = document.getElementById('page-title-confirmation');

    el?.dispatchEvent(new window.CustomEvent('page-title', {
        detail: title
    }));
}

export function PageTitleConfirmation() {
    const [docTitle, setDocTitle] = React.useState('');
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(
        () => {
            const el = ref.current as HTMLDivElement;
            const listener = ((e: CustomEvent) => {
                setDocTitle(e.detail);
            }) as EventListener;

            el.addEventListener('page-title', listener);
            return () => el.removeEventListener('page-title', listener);
        },
        []
    );

    return (
        <div id="page-title-confirmation" ref={ref} className="sr-only" aria-live="polite">
            {`Loaded page "${docTitle}"`}
        </div>
    );
}
