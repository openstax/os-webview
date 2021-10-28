export default {
    phone: {
        type: 'tel',
        name: 'phone',
        autocomplete: 'tel-national',
        minlength: 9,
        maxlength: 20,
        pattern: '[^a-zA-Z]{9,20}'
    },
    lastName: {
        type: 'text',
        name: 'last_name',
        required: true,
        autocomplete: 'family-name',
        maxlength: 35
    },
    firstName: {
        type: 'text',
        name: 'first_name',
        required: true,
        autocomplete: 'given-name',
        maxlength: 35
    },
    email: {
        type: 'email',
        name: 'email',
        required: true,
        autocomplete: 'email',
        maxlength: 64
    }
};
