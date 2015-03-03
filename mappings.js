var mappings = [
    {
        id: 1,
        selector: '#email',
        attribute: 'value',
        event: 'onChange',
        isEmail: true,
        isPhoneNumber: false
    },
    {
        id: 2,
        selector: '#firstName',
        attribute: 'value',
        event: 'onChange',
        isEmail: false,
        isPhoneNumber: false
    },
    {
        id: 3,
        selector: '#lastName',
        attribute: 'value',
        event: 'onChange',
        isEmail: false,
        isPhoneNumber: false
    },
    {
        id: 4,
        selector: 'input[name="sex"]',
        attribute: 'radio',
        event: 'onChange',
        isEmail: false,
        isPhoneNumber: false
    },
    {
        id: 5,
        selector: '#phoneNumber',
        attribute: 'value',
        event: 'onChange',
        isEmail: false,
        isPhoneNumber: true
    },
    {
        id: 6,
        selector: '#termsAndConditions',
        attribute: 'checkbox',
        event: 'onChange',
        isEmail: false,
        isPhoneNumber: false
    },
    {
        id: 7,
        selector: '.productName',
        attribute: 'text',
        event: 'onLoad',
        isEmail: false,
        isPhoneNumber: false
    },
    {
        id: 8,
        selector: '.productQuantity',
        attribute: 'text',
        event: 'onLoad',
        isEmail: false,
        isPhoneNumber: false
    },
    {
        id: 9,
        selector: '.productPrice',
        attribute: 'text',
        event: 'onLoad',
        isEmail: false,
        isPhoneNumber: false
    },
    {
        id: 10,
        selector: '#totalPrice',
        attribute: 'text',
        event: 'onLoad',
        isEmail: false,
        isPhoneNumber: false
    }
];