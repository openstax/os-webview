import settings from 'settings';
import componentType from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import Dropdown from '../dropdown/dropdown';
import {description as template} from './login-menu.html';
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

class LoginMenu extends componentType(spec, busMixin) {

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        window.addEventListener('navigate', () => this.update());
    }

    get isTutorUser() {
        return (this.user.groups || []).includes('OpenStax Tutor');
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
        const facultySignupStep4 = `${settings.accountHref}/i/signup/educator/profile_form`;
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
                label: 'Finish signing up',
                url: facultySignupStep4,
                exclude: () => Boolean(
                    (this.user.groups || []).includes('Student') ||
                    !this.user.needs_profile_completed ||
                    !this.user.is_newflow ||
                    this.user.stale_verification
                )
            },
            {
                label: 'Request instructor access',
                url: facultyAccessLink,
                exclude: () => Boolean(
                    (this.user.groups || []).includes('Faculty') ||
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
        const parentNode = this.el.parentNode;
        const dropdown = new Dropdown({
            el: this.el,
            dropdownLabel: `Hi ${this.user.first_name || this.user.username}`,
            items
        });

        return () => {
            if (!this.loggedIn) {
                dropdown.detach();
                delete this.updateDropdown;
                parentNode.appendChild(this.el);
                this.update();
            } else {
                dropdown.update();
            }
        };
    }

    whenPropsUpdated() {
        this.update();
    }

    onUpdate() {
        if (this.loggedIn && !this.updateDropdown) {
            this.updateDropdown = this.attachLoginDropdown();
            if (!this.isTutorUser) {
                this.pollAccounts();
            }
        }
        if (this.updateDropdown) {
            this.updateDropdown();
        }
    }

}

function menuProps(user) {
    return {
        user,
        loggedIn: Boolean(typeof user === 'object' && user.id)
    };
}

export default function (el) {
    const pulseInsights = {
        notified: false,
        notify(user) {
            if (!this.notified) {
                pi('identify_client', user.id);
                this.notified = true;
            }
        }
    };

    return userModelBus.get('userModel-load').then((user) => {
        const loginMenu = new LoginMenu(Object.assign(
            {el},
            menuProps(user)
        ));

        pulseInsights.notify(user);
        userModelBus.on('update-accountsModel', (updatedUser) => {
            loginMenu.emit('update-props', menuProps(updatedUser));
            pulseInsights.notify(updatedUser);
        });
        return loginMenu;
    });
}
