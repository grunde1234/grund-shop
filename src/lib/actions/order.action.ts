'use server'

import { isRedirectError } from "next/dist/client/components/redirect-error"
import { formatError } from "../utils";
import { prisma } from "../../../db/prisma";
import { auth } from "../../../auth";
import { getMyCart } from "./cart.action";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validators";
import { CartItem } from "@/Zod-schemas";

//action to create order and create order items in db
export async function createOrder() {
try{
    // Implementation for creating an order and its items
    const session = await auth();
    const userId = session?.user?.id;

    if(!session) throw new Error("User not authenticated");
    const cart = await getMyCart();


    if(!userId) throw new Error("User not found");
    if(!cart || cart.items.length === 0) throw new Error("Cart is empty");

    const user = await getUserById(userId);

    if(!cart || cart.items.length === 0){
        return{
            success: false,
            message: "Cart is empty",
            redirectTo: '/cart'
        }
    };
    if(!user.address){
        return{
            success: false,
            message: "User address not found",
            redirectTo: '/shipping-address'
        }
    };
    if(!user.paymentMethod){
        return{
            success: false,
            message: "User payment method not found",
            redirectTo: '/payment-method'
        }
    };

    // create order object

   // In createOrder(), after validations...
const orderData = insertOrderSchema.parse({
  userId: user.id,
  itemsPrice: cart.itemsPrice,  // Now matches schema
  shippingPrice: cart.shippingPrice,
  taxPrice: cart.taxPrice,
  totalPrice: cart.totalPrice,
  paymentMethod: user.paymentMethod,
  shippingAddress: user.address,
});

const insertedOrderId = await prisma.$transaction(async (tx) => {
  const insertedOrder = await tx.order.create({
    data: {
      ...orderData,
      orderItems: cart.items.map(item => ({
        productId: item.productId,
        name: item.name,  // Add from cart item
        slug: item.slug,
        image: item.image,
        qty: item.qty,
        price: item.price,
      })) || null,  // JSON array or null
    },
  });
  //create order items from cart items so iterate through cart items
  for(const item of cart.items as CartItem[]){
    await tx.orderItem.create({
      data: {
        orderId: insertedOrder.id,
        productId: item.productId,
        name: item.name,
        slug: item.slug,
        image: item.image,
        qty: item.qty,
        price: item.price,
      }
    })
  }
 //clear user cart after order is created
 await tx.cart.update({
    where: {id: cart.id},
    data: {items: [], itemsPrice: 0, shippingPrice: 0, taxPrice: 0, totalPrice: 0}
  })
  return insertedOrder.id;
  });


/* return { success: true, message: 'Order created successfully' };
 */
if(!insertedOrderId) throw new Error('Order creation failed');

return {
    success: true,
    message: 'Order created successfully',
    redirectTo: `/order/${insertedOrderId}`
};

}catch(error){
    if(isRedirectError(error))throw error;
    return {success: false, message: formatError(error)}
}
}

/* orderItems: cart.items.map(item => ({
        userId: userId,
        shippingAddress: user.address,
        paymentMethod: user.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice, */