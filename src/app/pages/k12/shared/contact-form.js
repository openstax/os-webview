import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './contact-form.scss';

const data = {
    submitUrl: 'https://forms.hsforms.com/submissions/v3/public/submit/formsnext/multipart/2889548/2cc01692-581c-43a4-8bb7-9cb812f40700',
    privacy: `<p>OpenStax is committed to protecting and respecting your privacy,
    and we’ll only use your personal information to administer your account and to
    provide the products and services you requested from us. By clicking submit,
    you consent to allow OpenStax to store and process the personal information
    submitted above to provide you the content requested.
    <a href="https://openstax.org/privacy-policy">Privacy Policy</a>*</p>`
};

export default function ContactForm() {
    return (
        <form action={data.submitUrl} method="POST">
            <div className="name-fields">
                <input type="text" name="firstname" autoComplete='given-name' placeholder="First name" />
                <input type="text" name="lastname" autoComplete='family-name' placeholder="Last name" />
            </div>
            <select name="role">
                <option disabled="" value="">Select your role</option>
                <option value="Teacher">Teacher</option>
                <option value="District Administrator">District Administrator</option>
                <option value="Researcher">Researcher</option>
                <option value="Other">Other</option>
            </select>
            <textarea name="message" placeholder="Comments" />
            <RawHTML className="privacy" html={data.privacy} />
            <input type="submit" value="Submit" />
        </form>
    );
}
