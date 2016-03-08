import Backbone from 'backbone';
import shell from '~/components/shell/shell';

class Router extends Backbone.Router {

    initialize() {
        this.route('*actions', 'default', () => {
            shell.load('404');
        });

        this.route('', 'home', () => {
            shell.load('home');
        });

        this.route(/subjects\/.*/, 'subjects', () => {
            if (!(shell.regions.main.views &&
                shell.regions.main.views[0].constructor.name === 'Subjects')) {
                shell.load('subjects');
            }
        });

        ['about', 'books', 'contact', 'news', 'license', 'subjects', 'details',
        'interest', 'adoption', 'adoption-confirmation', 'comp-copy',
        'accessibility-statement', 'faculty-verification', 'k-12', 'allies',
        'finish-profile', 'finished-verify', 'finished-no-verify']
        .forEach(this.standardRoute, this);

        this.route(/to[u|s]/, 'tos', () => {
            shell.load('tos');
        });
    }

    standardRoute(name) {
        this.route(name, name, () => {
            shell.load(name);
        });
    }

}

let router = new Router();

export default router;
