import settings from 'settings';
import componentType from '~/helpers/controller/init-mixin';
import Dropdown from '../dropdown/dropdown';
import {description as template} from './login-menu.html';
// import userModel, {accountsModel} from '~/models/usermodel';
import userModelBus from '~/models/usermodel-bus';
import linkHelper from '~/helpers/link';

const spec = {
    template,
    view: {
        classes: ['nav-menu-item', 'rightmost']
    },
    model() {
        return {
            loggedIn: this.loggedIn,
            loginUrl: linkHelper.loginLink()
        };
    }
};

// Slightly hacky; avoiding adding a new item to settings,
// but probably will do so eventually
const dqMatch = settings.accountHref.match(/-[^.]+/);
const domainQualifier = dqMatch ? dqMatch[0] : '';
const tutorDomain = `https://tutor${domainQualifier}.openstax.org/dashboard`;

class LoginMenu extends componentType(spec) {

    get isTutorUser() {
        return this.user.groups.includes('OpenStax Tutor');
    }

    setTutorUser() {
        if (!isTutorUser) {
            this.user.groups.push('OpenStax Tutor');
        }
    }

    pollAccounts() {
        const userPollInterval = setInterval(() => {
            userModelBus.get('accountsModel-load')
                .then((accountResponse) => {
                    const foundTutor = accountResponse.applications
                        .find((app) => app.name === 'OpenStax Tutor');

                    if (foundTutor) {
                        this.setTutorUser();
                        this.updateDropdown();
                        clearInterval(userPollInterval);
                    }
                });
        }, 60000);
    }

    attachLoginDropdown() {
        const facultyAccessLink = `${settings.accountHref}/faculty_access/apply`;
        const items = [
            {
                label: 'Account Profile',
                url: `${settings.accountHref}/profile`
            },
            {
                label: 'OpenStax Tutor',
                url: tutorDomain,
                exclude: () => !this.isTutorUser
            },
            {
                label: 'Request instructor access',
                url: facultyAccessLink,
                exclude: () => Boolean(
                    this.user.groups.includes('Faculty') ||
                    this.user.groups.includes('Student') ||
                    this.user.pending_verification
                )
            },
            {
                get url() {
                    return linkHelper.logoutLink();
                },
                label: 'Log out',
                isLocal: true
            }
        ];
        const dropdown = new Dropdown({
            el: this.el,
            dropdownLabel: `Hi ${this.user.first_name || this.user.username}`,
            items
        });

        return () => dropdown.update();
    }

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        if (this.loggedIn) {
            this.updateDropdown = this.attachLoginDropdown();
            if (!this.isTutorUser) {
                this.pollAccounts();
            }
        } else {
            this.boundUpdate = () => {
                this.update();
                if (this.updateDropdown) {
                    this.updateDropdown();
                }
            };
            window.addEventListener('navigate', this.boundUpdate);
        }
    }

    onClose() {
        window.removeEventListener('navigate', this.boundUpdate);
    }

}

export default function (el) {
    return new Promise((resolve) => {
        const promise = userModelBus.get('userModel-load');

        promise.then((user) => {
            const loggedIn = Boolean(typeof user === 'object' && user.id);

            if (loggedIn) {
                pi('identify_client', user.id);
            }

            resolve(new LoginMenu({
                el,
                user,
                loggedIn
            }));
        });
    });
}
