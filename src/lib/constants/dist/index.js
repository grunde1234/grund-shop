"use strict";
exports.__esModule = true;
exports.shippingAddressDefaultValues = exports.signUpDefaultValues = exports.signInDefaultValues = exports.LATEST_PRODUCTS_LIMIT = exports.SERVER_URL = exports.APP_DESCRIPTION = exports.APP_NAME = void 0;
exports.APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Prostore';
exports.APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || "E-commerce site";
exports.SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
exports.LATEST_PRODUCTS_LIMIT = Number(process.env.NEXT_PUBLIC_LATEST_PRODUCTS_LIMIT) || 4;
exports.signInDefaultValues = {
    email: '',
    password: ''
};
exports.signUpDefaultValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
};
exports.shippingAddressDefaultValues = {
    fullName: 'John Doe',
    streetAddress: '123 Main St',
    city: 'Dubai',
    postalCode: '123456',
    country: 'USA'
};
