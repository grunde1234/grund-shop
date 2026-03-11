'use server'

import { isRedirectError } from "next/dist/client/components/redirect-error"
import { convertToPlainObject, formatError } from "../utils";
import { prisma } from "../../../db/prisma";
import { auth } from "../../../auth";
import { getMyCart } from "./cart.action";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validators";
import { CartItem, PaymentResult } from "@/Zod-schemas";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";

export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error("User not authenticated");

    const [cart, user] = await Promise.all([
      getMyCart(),
      getUserById(session.user!.id!)
    ]);

    if (!cart?.items.length) return { success: false, message: "Cart is empty", redirectTo: '/cart' };
    if (!user.address)        return { success: false, message: "No shipping address", redirectTo: '/shipping-address' };
    if (!user.paymentMethod)  return { success: false, message: "No payment method", redirectTo: '/payment-method' };

    const orderData = insertOrderSchema.parse({
      userId: user.id,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
      paymentMethod: user.paymentMethod,
      shippingAddress: user.address,
    });
    //* Create order
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: { ...orderData, orderItems: cart.items.map(({ productId, name, slug, image, qty, price }) =>
          ({ productId, name, slug, image, qty, price })) }
      });
      //* Create order items from cart items
      await Promise.all(cart.items.map((item: CartItem) =>
        tx.orderItem.create({ data: { orderId: order.id, ...item } })
      ));
      //* Reset cart to empty
      await tx.cart.update({
        where: { id: cart.id },
        data: { items: [], itemsPrice: 0, shippingPrice: 0, taxPrice: 0, totalPrice: 0 }
      });

      return order.id;
    });

    if (!insertedOrderId) throw new Error('Order creation failed');
    return { success: true, message: 'Order created successfully', redirectTo: `/order/${insertedOrderId}` };

  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: formatError(error) };
  }
}
//* Get order by ID
export async function getOrderById(orderId: string) {
  return convertToPlainObject(await prisma.order.findFirst({
    where: { id: orderId },
    include: { orderitems: true, user: { select: { name: true, email: true } } }
  }));
}

export async function createPayPalOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({ where: { id: orderId } });
    if (!order) throw new Error('Order not found');

    const paypalOrder = await paypal.createOrder(Number(order.totalPrice));
    await prisma.order.update({
      where: { id: orderId },
      data: { PaymentResult: { paypalOrderId: paypalOrder.id, status: '', pricePaid: 0, email_address: '' } }
    });

    return { success: true, message: 'Payment processed successfully', data: paypalOrder.id };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}