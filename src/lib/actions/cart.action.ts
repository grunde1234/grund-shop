'use server'

import { cookies } from "next/headers"
import { CartItem } from "@/Zod-schemas"
import { formatError } from "../utils"
import { auth } from "../../../auth"
import { prisma } from "../../../db/prisma"
import { cartItemSchema, insertCartSchema } from "../validators"
import { convertToPlainObject, round2 } from "../utils"
import {revalidatePath} from 'next/cache'

// Calculate cart prices
const calcPrice = (items: CartItem[]) => {
  const itemPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  )

  const shippingPrice = round2(itemPrice > 10 ? 0 : 10)
  const taxPrice = round2((itemPrice * 15) / 100)
  const totalPrice = round2(itemPrice + shippingPrice + taxPrice)

  return {
    itemPrice: itemPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  }
}

export async function addItemToCart(data: CartItem) {
  try {
    // Check for session cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value
    if (!sessionCartId) throw new Error("Cart session not found")

    // Auth user
    const session = await auth()
    const userId = session?.user?.id ? (session.user.id as string) : undefined

    // Get existing cart
    const cart = await getMyCart()

    // Parse and validate item
    const item = cartItemSchema.parse(data)

    // Check product exists
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    })

    if (!product) throw new Error("Product not found")

    if (!cart) {
      // Create new cart
      const newCart = insertCartSchema.parse({
        userId,
        items: [item],
        sessionCartId,
        ...calcPrice([item]),
      })

      // Debug
     console.log("NEW CART:", newCart);

await prisma.cart.create({
  data: {
    userId: newCart.userId ?? null,
    sessionCartId: newCart.sessionCartId,

    // items is stored as JSON
    items: newCart.items,

    // Correct Prisma field names
    itemsPrice: newCart.itemPrice, 
    shippingPrice: newCart.shippingPrice,
    taxPrice: newCart.taxPrice,
    totalPrice: newCart.totalPrice,
  },
});

      //Revalidate the product page because of cleared cache
      revalidatePath(`/product/${product.slug}`)

      return {
      success: true,
      message: "Item added to cart successfully",
    }

    }else{
        
    }

    return {
      success: true,
      message: "Item added to cart successfully",
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function getMyCart() {
  // Check for session cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value
  if (!sessionCartId) throw new Error("Cart session not found")

  // Auth user
  const session = await auth()
  const userId = session?.user?.id ? (session.user.id as string) : undefined

  // Find cart in DB
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  })

  if (!cart) return undefined

  // Convert Prisma Decimal fields to JS strings
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  })
}
