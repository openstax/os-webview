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

        ['about', 'books', 'contact', 'news', 'license', 'subjects', 'details']
        .forEach(this.standardRoute.bind(this));

        this.route(/to[u|s]/, 'tos', () => {
            shell.load('tos');
        });

        this.route('adoptions', 'adoption-form', () => {
            shell.load('adoption-form');
        });

        this.route('interest', 'interest-form', () => {
            shell.load('interest-form');
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
