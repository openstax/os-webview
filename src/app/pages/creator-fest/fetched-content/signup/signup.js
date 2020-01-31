import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './signup.html';
import css from './signup.css';
import shellBus from '~/components/shell/shell-bus';
import {on} from '~/helpers/controller/decorators';
import SignupForm from './form/form';

const spec = {
    template,
    css,
    view: {
        classes: ['signup']
    },
    model() {
        return {
            sessions: this.sessions,
            expanded: this.expanded,
            expandable: this.expandable
        };
    }
};

export default class extends componentType(spec) {

    init(...args) {
        super.init(...args);
        this.expanded = this.sessions.map(() => '');
        this.expandable = this.sessions.map((s) => s.description.length > 150 ? 'expandable' : '');
    }

    @on('click a.btn:not(.disabled)')
    showSignupForm(event) {
        const sessionTitle = event.delegateTarget.dataset.session;
        const session = this.sessions.find((s) => s.title === sessionTitle);
        const form = new SignupForm({
            session
        });

        shellBus.emit('showDialog', () => ({
            title: '',
            content: form,
            onClose() {
                form.detach();
            }
        }));
    }

    @on('click .expandable')
    toggleExpanded(event) {
        const index = event.delegateTarget.dataset.item;

        this.expanded[index] = this.expanded[index] ? '' : 'expanded';
        this.update();
    }

}
