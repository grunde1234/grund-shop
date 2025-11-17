"use strict";
exports.__esModule = true;
exports.insertCartSchema = exports.cartItemSchema = exports.signupFromSchema = exports.signinFromSchema = exports.insertProductSchema = void 0;
var zod_1 = require("zod");
var utils_1 = require("./utils");
var currency = zod_1.z.string().refine(function (val) { return /^\d+(\.\d{2})?$/.test(utils_1.formatNumber(Number(val))); }, 'Invalid price format');
//schema for inserting products
exports.insertProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Name should be at least 3 characters'),
    slug: zod_1.z.string().min(3, 'Slug should be at least 3 characters'),
    category: zod_1.z.string().min(3, 'Category should be at least 3 characters'),
    brand: zod_1.z.string().min(3, 'Brand should be at least 3 characters'),
    description: zod_1.z.string().min(3, 'Description should be at least 3 characters'),
    stock: zod_1.z.coerce.number(),
    images: zod_1.z.array(zod_1.z.string()).min(1, 'Image is required and include at least one image'),
    /* image: z.any().refine((files)=>{
        return files?.[0]?.size <= 5000000 //5mb
    }) */
    isFeatured: zod_1.z.boolean().optional(),
    banner: zod_1.z.string().nullable(),
    price: currency
});
//schema for signing users in
exports.signinFromSchema = zod_1.z.object({
    email: zod_1.z.email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters')
});
//schema for signing users in
exports.signupFromSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Name should be at least 3 characters'),
    email: zod_1.z.email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: zod_1.z.string().min(6, 'confirm password must be at least 6 characters')
}).refine(function (data) { return data.password === data.confirmPassword; }, {
    message: "Passwords don't match",
    path: ['confirmPassword'] //field to set the error message
});
//Cart item schema
exports.cartItemSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1, 'Product required'),
    name: zod_1.z.string().min(1, 'Name required'),
    slug: zod_1.z.string().min(1, 'Slug required'),
    qty: zod_1.z.number().int().nonnegative('Quantity must be at least 1'),
    image: zod_1.z.string().min(1, 'Image required'),
    price: currency
});
exports.insertCartSchema = zod_1.z.object({
    items: zod_1.z.array(exports.cartItemSchema),
    itemPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    sessionCartId: zod_1.z.string().min(1, 'Session cart ID is required'),
    userId: zod_1.z.string().optional().nullable()
});
