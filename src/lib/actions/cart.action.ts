'use server'

import { CartItem } from "@/Zod-schemas"

export async function addItemToCart(data: CartItem) {
return {
    success: true, message: 'Item added to cart successfully'
}
}