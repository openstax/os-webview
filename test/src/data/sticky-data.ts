/* eslint-disable camelcase */
import type {BannerDataWithEmergency, BannerInfo} from '~/layouts/default/shared';

const banner: BannerInfo = {
    id: 1,
    name: 'Default Campaign',
    html_message:
        'Help students around the world succeed with <strong>contributions of $5, $10 or $20</strong>',
    link_text: 'Make a difference now',
    link_url: 'https://dev.openstax.org/give',
    banner_thumbnail:
        'https://assets.openstax.org/oscms-dev/media/original_images/subj-icon-science.png',
    is_active: true,
    start_date: null,
    end_date: null,
    context_filter: 'all',
    url_pattern: null
};

const bannerData: BannerDataWithEmergency = {
    mode: 'banner',
    emergency_expires: null,
    emergency_content: '',
    bannerConfigs: [banner]
};

export default bannerData;
