import VERSION from '~/version';
import {Controller} from 'superb.js';
import settings from 'settings';
import $ from '~/helpers/$';
import {description as template} from './resource-box.html';

export default class ResourceBox extends Controller {

    // Utility function to set the values associated with whether the resource
    // is available to the user (instructor version)
    static instructorResourceBoxPermissions(resourceData, userStatus, search) {
        const pathWithoutSearch = `${window.location.origin}${window.location.pathname}`;
        const encodedLocation = encodeURIComponent(`${pathWithoutSearch}?${search}`);
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
            `${settings.apiOrigin}/accounts/login/openstax/?next=${encodedLocation}`;
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
                    url: loginUrl
                }
            }
        };

        return statusToPermissions[status];
    };

    // Utility function for student resources
    static studentResourceBoxPermissions(resourceData, userStatus, search) {
        const pathWithoutSearch = `${window.location.origin}${window.location.pathname}`;
        const encodedLocation = encodeURIComponent(`${pathWithoutSearch}?${search}`);
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
                    url: `${settings.apiOrigin}/accounts/login/openstax/?next=${encodedLocation}`
                }
            }
        };

        return statusToPermissions[resourceStatus()];
    };


    init(model) {
        this.model = model;
        this.template = template;
        this.view = {
            classes: ['resource-box']
        };
        if (model.link) {
            this.view.tag = 'a';
            this.view.attributes= {
                href: model.link.url
            };
        }
        this.css = `/app/pages/details/resource-box/resource-box.css?${VERSION}`;
    }

    onUpdate() {
        $.insertHtml(this.el, this.model);
    }

}
