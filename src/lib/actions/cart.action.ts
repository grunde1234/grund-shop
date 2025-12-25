'use server'

import { cookies } from "next/headers"
import { CartItem } from "@/Zod-schemas"
import { formatError } from "../utils"
import { auth } from "../../../auth"
import { prisma } from "../../../db/prisma"
import { cartItemSchema, insertCartSchema } from "../validators"
import { convertToPlainObject, round2 } from "../utils"
import { revalidatePath } from 'next/cache'
/* import { Prisma } from '@prisma/client'
 */
// Calculate cart prices
//???????????????????
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
//????????????????

//************ */

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

    // ----------------------------------------------------
    // CASE 1: CART DOES NOT EXIST → CREATE NEW CART
    // ----------------------------------------------------
    if (!cart) {
      const newCart = insertCartSchema.parse({
        userId,
        items: [item],
        sessionCartId,
        ...calcPrice([item]),
      })

      console.log("NEW CART:", newCart)

      await prisma.cart.create({
        data: {
          userId: newCart.userId ?? null,
          sessionCartId: newCart.sessionCartId,
          items: newCart.items,
          itemsPrice: newCart.itemPrice,
          shippingPrice: newCart.shippingPrice,
          taxPrice: newCart.taxPrice,
          totalPrice: newCart.totalPrice,
        },
      })

      revalidatePath(`/product/${product.slug}`)

      return {
        success: true,
        message: `${product.name} added to cart successfully`,
      }
    }
//********** */
    // ----------------------------------------------------
    // CASE 2: CART EXISTS → UPDATE CART
    // ----------------------------------------------------
    const existItems = (cart.items as CartItem[]).find(
      (x) => x.productId === item.productId
    )

    if (existItems) {
      // check stock
      if (product.stock < existItems.qty + 1) {
        throw new Error("Not enough")
      }

      // increase qty
      existItems.qty = existItems.qty + 1
    } else {
      // new item, check stock
      if (product.stock < item.qty) {
        throw new Error("Not enough")
      }

      cart.items.push(item)
    }

    // save updated cart
    const prices = calcPrice(cart.items as CartItem[])

await prisma.cart.update({
  where: { id: cart.id },
  data: {
    items: cart.items,

    // MUST MATCH Prisma schema names
    itemsPrice: prices.itemPrice,
    shippingPrice: prices.shippingPrice,
    taxPrice: prices.taxPrice,
    totalPrice: prices.totalPrice,
  },
})
    //******** */


    revalidatePath(`/product/${product.slug}`)

    return {
      success: true,
      message: `${product.name} ${existItems ? "updated" : "added to"} cart`,
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function getMyCart() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value
  if (!sessionCartId) throw new Error("Cart session not found")

  const session = await auth()
  const userId = session?.user?.id ? (session.user.id as string) : undefined

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  })

  if (!cart) return undefined

  return convertToPlainObject({//utility
    ...cart,
    items: cart.items as CartItem[],//auto validation
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  })
}

export async function removeItemFromCart(productId: string){
  try{
    //Get cookies
     const sessionCartId = (await cookies()).get("sessionCartId")?.value
     if (!sessionCartId) throw new Error("Cart session not found")

    //Get Product
    const product =await prisma.product.findFirst({
      where:{
        id: productId
      }
    })

    if(!product) throw new Error('Product not found')
    
    //Get user cart

    const cart = await getMyCart();
    if(!cart)throw new Error('Cart not found');

    //Checking for item
    const exist = (cart.items as CartItem[]).find((x)=> x.productId === productId);
    
    if(!exist) throw new Error('Item not found');

    //Check if one then remove but if more then decrease the qty
    if(exist.qty === 1){
    cart.items = (cart.items as CartItem[]).filter((x)=> x.productId !== exist.productId)
    }
    else{
      //Decrease the qty
      (cart.items as CartItem[]).find((x)=> x.productId === productId)!.qty = exist.qty - 1;
    }
    //exist.qty -= 1

    //?????????????????????
    //************* */

    const prices = calcPrice(cart.items as CartItem[])


    //update cart in db
    await prisma.cart.update({
  where: { id: cart.id },
  data: {
    items: cart.items,

    // MUST MATCH Prisma schema names
    itemsPrice: prices.itemPrice,
    shippingPrice: prices.shippingPrice,
    taxPrice: prices.taxPrice,
    totalPrice: prices.totalPrice,
  },
});
//????????????????????????????
//********************* */

  revalidatePath(`/product/${product.slug}`);

  return {
      success: true,
      message: `${product.name} was remove from cart`,
    }
  }catch(error){
 return {
      success: false,
      message: formatError(error),
    } 
}
}