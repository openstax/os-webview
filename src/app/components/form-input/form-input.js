import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './form-input.html';

export default class FormInput extends Controller {

    init(props) {
        this.template = template;
        this.css = '/app/components/form-input/form-input.css';
        this.model = Object.assign({value: ''}, props);
        this.view = {
            tag: 'label',
            classes: ['form-input']
        };
    }

    @on('input input')
    filterSuggestions(event) {
        this.model.activeSuggestion = null;
        if (this.model.suggestions) {
            const typedValue = this.getValue().toLowerCase();

            if (typedValue.length > 1) {
                this.model.matches = this.model.suggestions.filter((s) => s.toLowerCase().includes(typedValue));
                // Don't suggest when exactly matched
                if (this.model.matches.length === 1 && this.model.matches[0].toLowerCase() === typedValue) {
                    this.setValue(this.model.matches[0]);
                }
                this.update();
                return;
            }
        }
        this.clearSuggestions();
    }

    clearSuggestions() {
        this.model.matches = null;
        this.update();
    }

    setActiveSuggestion(value) {
        this.model.activeSuggestion = value;
        this.update();
    }

    @on('mouseover .suggestion')
    setSuggestionByMouse(event) {
        this.setActiveSuggestion(event.target.textContent);
    }

    @on('keydown')
    operateByKey(event) {
        /* eslint complexity: 0 */
        if (this.model.matches) {
            let matchIndex = this.model.matches.indexOf(this.model.activeSuggestion);
            const lastIndex = this.model.matches.length - 1;

            switch (event.keyCode) {
            case $.key.up:
                if (matchIndex > 0) {
                    --matchIndex;
                } else {
                    matchIndex = 0;
                }
                this.setActiveSuggestion(this.model.matches[matchIndex]);
                event.preventDefault();
                break;
            case $.key.down:
                if (matchIndex < lastIndex) {
                    ++matchIndex;
                } else {
                    matchIndex = lastIndex;
                }
                this.setActiveSuggestion(this.model.matches[matchIndex]);
                event.preventDefault();
                break;
            case $.key.enter:
                if (matchIndex >= 0) {
                    this.setValue(this.model.matches[matchIndex]);
                }
                event.preventDefault();
                break;
            default:
                break;
            }
        }
    }

    getValue() {
        return this.el.querySelector('input').value;
    }

    setValue(value) {
        this.el.querySelector('input').value = value;
        this.clearSuggestions();
    }

    @on('click .suggestion')
    populateFromClick(event) {
        this.el.querySelector('input').focus();
        this.setValue(event.target.textContent);
        event.preventDefault();
    }

    @on('focusout input')
    clearSuggestionsIfNoLongerFocus() {
        setTimeout(() => {
            if (document.activeElement !== this.el.querySelector('input')) {
                this.clearSuggestions();
            }
        }, 200);
    }

}
