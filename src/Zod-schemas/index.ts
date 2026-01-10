import { z } from "zod";
import { 
insertProductSchema,
insertCartSchema,
cartItemSchema,
shippingAddressSchema,
insertOrderSchema,
orderItemSchema
 } from "@/lib/validators";


export type Product = z.infer<typeof insertProductSchema> & {
    id: string,
    rating: string,
    createdAt: Date
}

export type Cart = z.infer<typeof insertCartSchema>

export type CartItem = z.infer<typeof cartItemSchema>
/* export type Product ={
    id: string,
    name: string
} */
export type ShippingAddress = z.infer<typeof shippingAddressSchema>

export type OrderItem = z.infer<typeof orderItemSchema>

export type Order = z.infer<typeof insertOrderSchema>  & {
    id: string;
    createdAt: Date;
    isPaid: boolean;
    paidAt: Date | null;
    isDelivered: boolean;
    deliveredAt: Date | null;
    orderitems: OrderItem[];
    user: {
       /*  id: string; */
        name: string;
        email: string;
    };
}

