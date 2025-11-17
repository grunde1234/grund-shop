import {z} from 'zod'
import { formatNumber } from './utils'

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