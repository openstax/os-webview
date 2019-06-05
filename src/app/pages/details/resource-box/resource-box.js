import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import settings from 'settings';
import {description as template} from './resource-box.html';
import css from './resource-box.css';

function pathWithoutSearch() {
    return `${window.location.origin}${window.location.pathname}`;
}

const spec = {
    template,
    css,
    view: {
        classes: ['resource-box']
    }
};

export default class extends componentType(spec, insertHtmlMixin) {

    // Utility function to set the values associated with whether the resource
    // is available to the user (instructor version)
    static instructorResourceBoxPermissions(resourceData, userStatus, search) {
        const encodedLocation = encodeURIComponent(`${pathWithoutSearch()}?${search}`);
        const isExternal = Boolean(resourceData.link_external);
        const resourceStatus = () => {
            if (resourceData.resource_unlocked || userStatus.isInstructor) {
                return 'unlocked';
            }
            if (userStatus.pendingVerification) {
                return 'pending';
            }
            return 'locked';
        };
        const loginUrl = userStatus.userInfo && userStatus.userInfo.id ?
            `${settings.accountHref}/faculty_access/apply?r=${encodedLocation}` :
            `${settings.apiOrigin}/oxauth/login/?next=${encodedLocation}`;
        const status = resourceStatus();
        const statusToPermissions = {
            unlocked: {
                iconType: isExternal ? 'external-link-alt' : 'download',
                link: {
                    text: resourceData.link_text,
                    url: resourceData.link_external || resourceData.link_document_url
                }
            },
            pending: {
                iconType: 'lock'
            },
            locked: {
                iconType: 'lock',
                link: {
                    text: 'Click here to unlock',
                    url: loginUrl,
                    local: true
                }
            }
        };

        return statusToPermissions[status];
    };

    // Utility function for student resources
    static studentResourceBoxPermissions(resourceData, userStatus, search) {
        const encodedLocation = encodeURIComponent(`${pathWithoutSearch()}?${search}`);
        const isExternal = Boolean(resourceData.link_external);
        const resourceStatus = () => {
            if (resourceData.resource_unlocked || userStatus.isStudent) {
                return 'unlocked';
            }
            return 'locked';
        };
        const statusToPermissions = {
            unlocked: {
                iconType: isExternal ? 'external-link-alt' : 'download',
                link: {
                    text: resourceData.link_text,
                    url: resourceData.link_external ||resourceData.link_document_url
                }
            },
            locked: {
                iconType: 'lock',
                link: {
                    text: 'Click here to unlock',
                    url: `${settings.apiOrigin}/oxauth/login/?next=${encodedLocation}`
                }
            }
        };

        return statusToPermissions[resourceStatus()];
    };

    init(model) {
        super.init();
        this.model = model;
        if (model.link) {
            Object.assign(this.view, {
                tag: 'a',
                attributes: {
                    href: model.link.url
                }
            });
            if (model.link.local) {
                this.view.attributes['data-local'] = 'true';
            }
        }
    }

}
