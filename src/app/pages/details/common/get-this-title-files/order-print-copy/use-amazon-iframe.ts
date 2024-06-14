import React from 'react';
import useDetailsContext from '../../../context';
import useAmazonAssociatesLink from '../amazon-associates-link';
import {isRealPrintLink} from '~/pages/details/common/get-this-title-files/options';
import {IntlShape, useIntl} from 'react-intl';
import {faUser} from '@fortawesome/free-solid-svg-icons/faUser';

export default function useAmazonIframe(slug: string) {
    const {amazonIframe} = useDetailsContext();
    const amazonDataLink = useAmazonAssociatesLink(slug);
    const {formatMessage} = useIntl();

    const iframeCode = React.useMemo(
        () => amazonIframe?.length > 0 ? (`
            ${amazonIframe}
        `) : null,
        [amazonIframe]
    );

    return iframeCode ?? amazonButton(amazonDataLink, formatMessage);
}

function amazonButton(
    amazonDataLink: ReturnType<typeof useAmazonAssociatesLink>,
    formatMessage: IntlShape['formatMessage']
) {
    const individual = formatMessage({
        id: 'printcopy.individual',
        defaultMessage: 'Individual'
    });
    const button1Text = formatMessage({
        id: 'printcopy.button1',
        defaultMessage: 'Buy a print copy'
    });

    if (!isRealPrintLink(amazonDataLink.url)) {
        return null;
    }

    return ({
        headerText: individual,
        headerIcon: faUser,
        buttonText: button1Text,
        buttonUrl: amazonDataLink.url
    });
}
