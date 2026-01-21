import {z} from 'zod'
import { formatNumber } from './utils'
import {PAYMENT_METHODS} from '@/lib/constants/index'

const currency =  z.string().refine((val)=> /^\d+(\.\d{2})?$/.test(formatNumber(Number(val))) , 'Invalid price format')

//schema for inserting products
export const insertProductSchema = z.object({
    name: z.string().min(3, 'Name should be at least 3 characters'),
    slug: z.string().min(3, 'Slug should be at least 3 characters'),
    category: z.string().min(3, 'Category should be at least 3 characters'),
    brand: z.string().min(3, 'Brand should be at least 3 characters'),
    description: z.string().min(3, 'Description should be at least 3 characters'),
    stock: z.coerce.number(),
    images: z.array(z.string()).min(1, 'Image is required and include at least one image'),
    /* image: z.any().refine((files)=>{
        return files?.[0]?.size <= 5000000 //5mb 
    }) */
   isFeatured: z.boolean().optional(),
   banner: z.string().nullable(),
   price: currency,
})

//schema for signing users in
export const signinFromSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(6,'Password must be at least 6 characters')
})

//schema for signing users in
export const signupFromSchema = z.object({
    name: z.string().min(3, 'Name should be at least 3 characters'),
    email: z.email('Invalid email address'),
    password: z.string().min(6,'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6,'confirm password must be at least 6 characters'),
}).refine((data)=> data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path:['confirmPassword']//field to set the error message
})

//Cart item schema
export const cartItemSchema = z.object({
    productId: z.string().min(1, 'Product required'),
    name: z.string().min(1, 'Name required'),
    slug: z.string().min(1, 'Slug required'),
    qty: z.number().int().nonnegative('Quantity must be at least 1'),
    image: z.string().min(1, 'Image required'),
    price: currency,
})

export const insertCartSchema = z.object({
    items: z.array(cartItemSchema),
    itemPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    sessionCartId: z.string().min(1, 'Session cart ID is required'),
    userId: z.string().optional().nullable(),
})

//Schema for shipping address
export const shippingAddressSchema = z.object({
    fullName: z.string().min(3, 'Name must be atleast 3 characters'),
    streetAddress: z.string().min(3, 'Address must be atleast 3 characters'),
    city: z.string().min(3, 'City must be atleast 3 characters'),
    postalCode: z.string().min(3, 'Postal code must be atleast 3 characters'),
    country: z.string().min(3, 'Country must be atleast 3 characters'),
    lat: z.number().optional(),
    lng: z.number().optional(),
})

//Schema for Payment method
export const paymentMethodSchema = z.object({
    type: z.string().min(1, 'Payment method is required').refine((data) => PAYMENT_METHODS.includes(data), { path: ['type'], message: 'Invalid payment method' })
})

//Inserting order
export const insertOrderSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    itemsPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    totalPrice: currency,
    paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), { message: 'Invalid payment method' }),
    shippingAddress: shippingAddressSchema,
});

//Inserting order item
export const orderItemSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    image: z.string().min(1, 'Image is required'),
    qty: z.number().int().nonnegative('Quantity must be at least 1'),
    price: currency,
})