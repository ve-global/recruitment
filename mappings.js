var mappings = [
    {
        id: 1,
        dataDescription: 'email',
        selector: '#email',
        attribute: 'value',
        event: 'onChange',
        isEmail: true,
        isPhoneNumber: false
    },
    {
        id: 2,
        dataDescription: 'firstName',
        selector: '#firstName',
        attribute: 'value',
        event: 'onChange',
        isEmail: false,
        isPhoneNumber: false
    },
    {
        id: 3,
        dataDescription: 'lastName',
        selector: '#lastName',
        attribute: 'value',
        event: 'onChange',
        isEmail: false,
        isPhoneNumber: false
    },
    {
        id: 4,
        dataDescription: 'sex',
        selector: 'input[name="sex"]',
        attribute: 'radio',
        event: 'onChange',
        isEmail: false,
        isPhoneNumber: false
    },
    {
        id: 5,
        dataDescription: 'phoneNumber',
        selector: '#phoneNumber',
        attribute: 'value',
        event: 'onChange',
        isEmail: false,
        isPhoneNumber: true
    },
    {
        id: 6,
        dataDescription: 'termsAndConditions',
        selector: '#termsAndConditions',
        attribute: 'checkbox',
        event: 'onChange',
        isEmail: false,
        isPhoneNumber: false
    },
    {
        id: 7,
        dataDescription: 'productName',
        selector: '.productName',
        attribute: 'text',
        event: 'onLoad',
        isEmail: false,
        isPhoneNumber: false
    },
    {
        id: 8,
        dataDescription: 'productQuantity',
        selector: '.productQuantity',
        attribute: 'text',
        event: 'onLoad',
        isEmail: false,
        isPhoneNumber: false
    },
    {
        id: 9,
        dataDescription: 'productPrice',
        selector: '.productPrice',
        attribute: 'text',
        event: 'onLoad',
        isEmail: false,
        isPhoneNumber: false
    },
    {
        id: 10,
        dataDescription: 'totalPrice',
        selector: '#totalPrice',
        attribute: 'text',
        event: 'onLoad',
        isEmail: false,
        isPhoneNumber: false
    }
];