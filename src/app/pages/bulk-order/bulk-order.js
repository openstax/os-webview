import {Controller} from 'superb';
import CMSPageController from '~/controllers/cms';
import {on} from '~/helpers/controller/decorators';
import settings from 'settings';
import $ from '~/helpers/$';
import selectHandler from '~/handlers/select';
import {highSchoolSlugs} from '~/models/book-titles';
import {render as template} from './bulk-order.html';
import {render as oiTemplate} from './order-items.html';

class OrderItems extends CMSPageController {

    init(model) {
        this.template = oiTemplate;
        this.model = model;
        this.model.amazonUrl = 'https://www.amazon.com/s?marketplaceID=ATVPDKIKX0DER&me=A1540JPBBI3F06&merchant=A1540JPBBI3F06&redirect=true';
        this.slug = 'books';
    }

    onDataLoaded() {
        const pages = this.pageData.books
            .filter((book) => highSchoolSlugs.includes(book.slug));

        this.model.orderItems = pages.map((p) => ({
            item: p.title,
            quantity: 25,
            list: p.amazon_price,
            min: 25,
            validationMessage: (name) => {
                const el = this.el.querySelector(`[name="${name}"]`);

                return (this.parent.hasBeenSubmitted && el) ? el.validationMessage : '';
            }
        }));
        this.update();
        $.insertHtml(this.el, this.model);
    }

    @on('change')
    updateOrder(event) {
        const el = event.target;
        const row = el.dataset.row;

        if (row) {
            this.model.orderItems[row].quantity = +el.value;
        }
        this.update();
    }

}

export default class BulkOrder extends Controller {

    init() {
        this.template = template;
        this.view = {
            classes: ['bulk-order', 'page']
        };
        this.css = '/app/pages/bulk-order/bulk-order.css';
        this.model = {
            origin: settings.apiOrigin,
            orgTypeOptions: [
                'Retail/For profit',
                'Public school',
                'Private school'
            ],
            orderItems: [],
            validationMessage: (name) => {
                const el = this.el.querySelector(`[name="${name}"]`);

                return (this.hasBeenSubmitted && el) ? el.validationMessage : '';
            }
        };
        this.regions = {
            orderItems: 'insert-component[data-name="orderItems"]'
        };
    }

    onLoaded() {
        document.title = 'Bulk Order Form - OpenStax';
        selectHandler.setup(this);
        this.regions.orderItems.attach(new OrderItems(this.model));
        fetch(`${this.model.origin}/api/mail/send_mail/`, {credentials: 'include'})
            .then((data) => data.json())
            .then((data) => {
                this.model.csrfToken = data.csrf_token;
                document.cookie = `csrftoken=${data.csrf_token}`;
                this.update();
            });
    }

    updateMessageBody() {
        const queryByName = (name) => this.el.querySelector(`[name=${name}]`).value;
        const orgName = queryByName('organization');
        const orgType = queryByName('organization_type');
        const fromName = queryByName('from_name');
        const fromAddress = queryByName('from_address');
        const phone = queryByName('phone');
        const country = queryByName('country');

        this.model.messageBody =`
        From: ${fromName}
        Organization: ${orgName} (${orgType})
        Email: ${fromAddress}
        Phone: ${phone}
        Country: ${country}
        `;
        this.model.orderItems.filter((line) => line.quantity)
            .forEach((line) => {
                this.model.messageBody += `
                ${line.item} x ${line.quantity}`;
            });
    }

    @on('focusout input')
    markVisited(event) {
        event.delegateTarget.classList.add('visited');
    }

    @on('change')
    updateOnChange() {
        this.updateMessageBody();
        this.update();
    }

    @on('click [type="submit"]')
    doCustomValidation(event) {
        const invalid = this.el.querySelector('form :invalid');

        this.hasBeenSubmitted = true;
        if (invalid) {
            event.preventDefault();
            this.update();
        }

        for (const child of this.regions.orderItems.controllers) {
            child.update();
        }
    }

}
