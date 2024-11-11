import React from 'react';
import LinksToTranslations from './common/links-to-translations';
import JITLoad from '~/helpers/jit-load';
import useWindowContext from '~/contexts/window';

const importPhoneView = () => import('./phone-view/phone-view');
const importDesktopView = () => import('./desktop-view/desktop-view');

export default function DualView() {
    const viewsUsed = useViewsUsed();

    return (
        <React.Fragment>
            {
                viewsUsed.phone &&
                <div className='phone-view'>
                    <LinksToTranslations />
                    <JITLoad importFn={importPhoneView} />
                </div>
            }
            {
                viewsUsed.desktop &&
                <div className='bigger-view'>
                    <LinksToTranslations />
                    <JITLoad importFn={importDesktopView} />
                </div>
            }
        </React.Fragment>
    );
}

function useViewsUsed() {
    const {innerWidth} = useWindowContext();
    const [phone, setPhone] = React.useState<boolean>(false);
    const [desktop, setDesktop] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (innerWidth <= 600) {
            setPhone(true);
        } else {
            setDesktop(true);
        }
    }, [innerWidth]);

    return React.useMemo(
        () => ({
            phone,
            desktop
        }),
        [phone, desktop]
    );
}
