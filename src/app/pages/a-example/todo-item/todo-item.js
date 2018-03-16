import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import {description as template} from './todo-item.html';

export default class TodoItem extends Controller {

    init(getProps, handlers) {
        this.template = template;
        this.getProps = getProps;
        this.handlers = handlers;
        this.view = {
            tag: 'li',
            classes: ['todo-item']
        };
        this.model = () => this.getModel();
    }

    getModel() {
        this.props = this.getProps();

        return {
            item: this.props.item,
            editing: this.props.editing
        };
    }

    onUpdate() {
        this.el.classList.toggle('editing', this.props.editing);
        this.el.classList.toggle('completed', this.props.item.completed);

        // Properties cannot be set in the view, so set them here
        const input = this.el.querySelector('.edit');
        const checkbox = this.el.querySelector('.toggle');

        checkbox.checked = this.props.item.completed;
        if (this.props.editing) {
            input.value = this.props.item.title;
            input.focus();
        }
    }

    @on('dblclick [data-edit-on-dblclick]')
    editOnDoubleClick() {
        this.handlers.startEdit(this.props.item);
    }

    @on('click .destroy')
    removeOnClick() {
        this.handlers.remove(this.props.item);
    }

    @on('change .toggle')
    setCompletedFromCheckbox(event) {
        this.handlers.setComplete(this.props.item, event.target.checked);
    }

    @on('keyup .edit')
    saveOrCancelEdit(event) {
        if (event.keyCode === $.key.enter) {
            const value = event.target.value.trim();

            if (value) {
                this.handlers.saveEdit(this.props.item, value);
            } else {
                this.handlers.remove(this.props.item);
            }
            this.handlers.endEdit();
        } else if (event.keyCode === $.key.esc) {
            this.handlers.endEdit();
        }
    }

    @on('focusout [data-edit-item]')
    saveEdit(event) {
        const index = event.target.getAttribute('data-edit-item');
        const todo = this.todos[index];

        if (this.editedTodo) {
            this.updateTitle(todo, event.target.value.trim());
        }
    }


}
