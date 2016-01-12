import Backbone from 'backbone';
import shell from '~/components/shell/shell';

class Router extends Backbone.Router {

    initialize() {
        this.route('*actions', 'default', () => {
            shell.render('404');
        });

        this.route('', 'home', () => {
            console.debug("Rendering home by default");
            shell.render('home');
        });

        this.route('home', 'home', () => {
            console.debug("Rendering home explicitly");
            shell.render('home');
        });

        this.route('about', 'about', () => {
            console.debug("Trying to render adoption");
            shell.render('adoption');
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
