import VERSION from '~/version';
import {Controller} from 'superb.js';
import ComponentArray from '~/helpers/controller/component-array';
import TodoItem from './todo-item/todo-item';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import {description as template} from './a-example.html';

const filters = {
    all(todos) {
        return todos;
    },
    active(todos) {
        return todos.filter((todo) => !todo.completed);
    },
    completed(todos) {
        return todos.filter((todo) => todo.completed);
    }
};

export default class Example extends Controller {

    init() {
        this.template = template;
        this.view = {
            classes: ['todo-page', 'page']
        };
        this.css = `/app/pages/a-example/a-example.css?${VERSION}`;

        // Any other state setup
        this.todos = [];
        this.newTodo = '';
        this.editedTodo = null;
        this.visibility = 'all';

        this.regions = {
            itemArray: '[data-item-array]'
        };

        this.model = () => this.getModel();
    }

    onLoaded() {
        this.componentArray = new ComponentArray(
            () => filters[this.visibility](this.todos),
            (item) => new TodoItem(
                () => ({
                    item,
                    editing: this.editedTodo === item
                }),
                {
                    startEdit: (todo) => {
                        this.editedTodo = todo;
                        this.update();
                    },
                    remove: (todo) => {
                        const index = this.todos.indexOf(todo);

                        this.todos.splice(index, 1);
                        this.update();
                    },
                    setComplete: (todo, whether) => {
                        todo.completed = whether;
                        this.update();
                    },
                    saveEdit: (todo, value) => {
                        todo.title = value;
                        this.update();
                    },
                    endEdit: () => {
                        this.editedTodo = null;
                        this.update();
                    }
                }
            ),
            this.regions.itemArray
        );
    }

    getModel() {
        const remaining = filters.active(this.todos).length;

        return {
            todos: this.todos,
            filteredTodos: filters[this.visibility](this.todos),
            remaining,
            hideList: $.booleanAttribute(this.todos.length === 0),
            hideClearCompleted: $.booleanAttribute(this.todos.length === remaining),
            pluralize: (word, count) => word + (count === 1 ? '' : 's'),
            allDone: $.booleanAttribute(remaining === 0),
            selected: (filter) => {
                return filter === this.visibility ? 'selected' : '';
            }
        };
    }

    onUpdate() {
        if (this.componentArray) {
            this.componentArray.update();
        }
    }

    addTodo(newTodo) {
        const value = newTodo && newTodo.trim();

        if (!value) {
            return;
        }
        this.todos.push({ title: value, completed: false });
    }

    @on('keyup .new-todo')
    addTodoOnEnter(event) {
        if (event.keyCode === $.key.enter) {
            this.addTodo(event.target.value);
            event.target.value = '';
            this.update();
        }
    }

    @on('click .filters a')
    setVisibilityFromLink(event) {
        const href = event.delegateTarget.href;
        const newVisibility = href.split('#/')[1]; // skip "/#"

        this.visibility = newVisibility;
        this.update();
    }

    @on('change [data-on-change-toggle-all]')
    setAllDone(event) {
        const checked = event.target.checked;

        for (const todo of this.todos) {
            todo.completed = checked;
        }
        this.update();
    }

    @on('click .clear-completed')
    clearCompleted() {
        this.todos = filters.active(this.todos);
        this.update();
    }

}
