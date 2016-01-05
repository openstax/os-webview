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
    }

}

let router = new Router();

export default router;
