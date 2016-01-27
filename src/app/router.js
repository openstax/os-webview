import Backbone from 'backbone';
import shell from '~/components/shell/shell';

class Router extends Backbone.Router {

    initialize() {
        this.route('*actions', 'default', () => {
            shell.render('404');
        });

        this.route('', 'home', () => {
            shell.render('home');
        });

        this.route('about', 'about', () => {
            shell.render('about');
        });

        this.route('books', 'books', () => {
            shell.render('books');
        });

        this.route('contact', 'contact', () => {
            shell.render('contact');
        });

        this.route('news', 'news', () => {
            shell.render('news');
        });

        this.route(/to[u|s]/, 'tos', () => {
            shell.render('tos');
        });

        this.route('license', 'license', () => {
            shell.render('license');
        });

        this.route('adoptions', 'adoption-form', () => {
            shell.render('adoption-form');
        });
    }

}

let router = new Router();

export default router;
