import Backbone from 'backbone';
import shell from '~/components/shell/shell';
import analytics from '~/helpers/analytics';

const PAGES = [
    'about',
    'about-us',
    'accessibility-statement',
    'adopters',
    'adoption',
    'adoption-confirmation',
    'article',
    'partners',
    'blog',
    'books',
    'comp-copy',
    'comp-copy-confirmation',
    'contact',
    'contact-thank-you',
    'details',
    'faculty-confirmation',
    'faculty-verification',
    'finish-profile',
    'finished-no-verify',
    'finished-verify',
    'foundation',
    'higher-ed',
    'interest',
    'interest-confirmation',
    'impact',
    'k-12',
    'license',
    'renewal',
    'mass-renewal',
    'subjects'
];

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

        this.route(/partners\/.*/, 'partners', () => {
            if (!(shell.regions.main.views &&
                shell.regions.main.views[0].constructor.name === 'Partners')) {
                shell.load('partners');
            }
        });

        this.route(/details\/.*/, 'details', () => {
            shell.load('details');
        });

        this.route(/blog\/.+/, 'article', () => {
            shell.load('article');
        });

        PAGES.forEach(this.standardRoute, this);

        this.route(/to[u|s]/, 'tos', () => {
            shell.load('tos');
        });
    }

    standardRoute(name) {
        this.route(name, name, () => {
            shell.load(name);
        });
    }

    navigate(fragment, options = {}, cb) {
        super.navigate(...arguments);

        if (options.analytics !== false) {
            analytics.sendPageview();
        }

        if (typeof cb === 'function') {
            cb();
        }
    }

}

let router = new Router();

export default router;
