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

        this.route('about', 'about', () => {
            shell.load('about');
        });

        this.route('books', 'books', () => {
            shell.load('books');
        });

        this.route('contact', 'contact', () => {
            shell.load('contact');
        });

        this.route('news', 'news', () => {
            shell.load('news');
        });

        this.route(/to[u|s]/, 'tos', () => {
            shell.load('tos');
        });

        this.route('license', 'license', () => {
            shell.load('license');
        });

        this.route('adoptions', 'adoption-form', () => {
            shell.load('adoption-form');
        });

        this.route('interest', 'interest-form', () => {
            shell.load('interest-form');
        });
    }

}

let router = new Router();

export default router;
