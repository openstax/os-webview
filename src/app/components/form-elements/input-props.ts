export default {
    phone: {
        type: 'tel',
        name: 'phone',
        autoComplete: 'tel-national',
        minlength: 9,
        maxLength: 20,
        pattern: '[^a-zA-Z]{9,20}'
    },
    lastName: {
        type: 'text',
        name: 'last_name',
        required: true,
        autoComplete: 'family-name',
        maxLength: 35
    },
    firstName: {
        type: 'text',
        name: 'first_name',
        required: true,
        autoComplete: 'given-name',
        maxLength: 35
    },
    email: {
        type: 'email',
        name: 'email',
        required: true,
        autoComplete: 'email',
        maxLength: 64
    }
};
