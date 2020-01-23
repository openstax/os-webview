import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './fetched-content.html';
import css from './fetched-content.css';
import $ from '~/helpers/$';
import Signup from './signup/signup';
import cmsFetch from '~/models/cmsFetch';

const spec = {
    template,
    css,
    get view() {
        return {
            tag: 'section'
        };
    }
};

export default class extends componentType(spec) {

    onLoaded() {
        const el = this.el;

        el.classList.add(this.pageId);
        fetch(this.url)
            .then((r) => r.text())
            .then((html) => {
                const parser = new DOMParser();
                const newDoc = parser.parseFromString(html, 'text/html');
                const destEl = el.querySelector('.boxed');

                destEl.innerHTML = '';
                Array.from(newDoc.body.children).forEach((child) => {
                    destEl.appendChild(child);
                });
                $.activateScripts(destEl);
                if ((/session/).test(this.url)) {
                    this.addSignup();
                }
            });
    }

    addSignup() {
        cmsFetch('events/sessions').then((sessions) => {
            const dateFormatSpec = {
                weekday: 'long', month: 'long', day: 'numeric'
            };
            const timeFormatSpec = {
                hour: 'numeric', minute: '2-digit'
            };
            const toCanonicalSession = (s) => {
                const nativeDate = new Date(s.date);

                return {
                    id: s.id,
                    title: s.name,
                    seatsRemaining: s.seats_remaining,
                    date: nativeDate.toLocaleDateString('en-US', dateFormatSpec),
                    time: nativeDate.toLocaleTimeString('en-US', timeFormatSpec),
                    location: s.location,
                    description: s.description || '[no description]'
                };
            };

            this.regionFrom('.boxed').append(new Signup({
                sessions: sessions.map(toCanonicalSession)
            }));
        });
    }

}
