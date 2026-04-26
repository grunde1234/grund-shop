"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { prisma } from "../../../db/prisma";
import { auth } from "../../../auth";
import { getMyCart } from "./cart.action";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validators";
import { CartItem, PaymentResult } from "@/Zod-schemas";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";
/* import { JsonArray } from "@prisma/client/runtime/library";
import { JsonValue } from "@/generated/prisma/runtime/library";
 */
import { Prisma } from "@prisma/client";
import { PAGE_SIZE } from "../constants";
export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error("User not authenticated");

    const [cart, user] = await Promise.all([
      getMyCart(),
      getUserById(session.user!.id!),
    ]);

    if (!cart?.items.length)
      return { success: false, message: "Cart is empty", redirectTo: "/cart" };
    if (!user.address)
      return {
        success: false,
        message: "No shipping address",
        redirectTo: "/shipping-address",
      };
    if (!user.paymentMethod)
      return {
        success: false,
        message: "No payment method",
        redirectTo: "/payment-method",
      };
      //? Parse whan sending to DB
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
        data: {
          ...orderData,
          orderItems: cart.items.map(
            ({ productId, name, slug, image, qty, price }) => ({
              productId,
              name,
              slug,
              image,
              qty,
              price,
            }),//map to pick the only needed fields if i put it directly it presents an error and destructionringy That's because this is a Prisma nested create. You're not creating one orderItem, you're telling Prisma: "Create this order AND create all these orderItems at the same time" So map is preparing that array of items for Prisma to batch create all at once.
          ),
        },
      });
      //* Create order items from cart items
      await Promise.all(
        cart.items.map((item: CartItem) =>
          tx.orderItem.create({ data: { orderId: order.id, ...item } }),
        ),
      );
      //* Reset cart to empty
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          totalPrice: 0,
        },
      });

      return order.id;
    });
    //? A simple way to remember it — return { success: true } is always what you want to happen. The if check before it is just a guard that stops execution if something went wrong before reaching that return.
    if (!insertedOrderId) throw new Error("Order creation failed");
    //?else
    return {
      success: true,
      message: "Order created successfully",
      redirectTo: `/order/${insertedOrderId}`,
    };
    //?
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: formatError(error) };
  }
}
//* Get order by ID
export async function getOrderById(orderId: string) {
  return convertToPlainObject(
    await prisma.order.findFirst({
      where: { id: orderId },
      include: {
        orderitems: true,//get everything since it is not originally part of the model
        user: { select: { name: true, email: true } },//Like include but select what you are adding to model
      },
    }),
  );
}

//creating order in the DB
export async function createPayPalOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({ where: { id: orderId } });
    if (!order) throw new Error("Order not found");

    const paypalOrder = await paypal.createOrder(Number(order.totalPrice));
    await prisma.order.update({
      where: { id: orderId },
      data: {
        PaymentResult: {
          id: paypalOrder.id,
          status: "",//will be filled when payment is captured or approved buy the user on the UI side
          pricePaid: 0,
          email_address: "",
        },
      },
    });

    return {
      success: true,
      message: "Payment processed successfully",
      data: paypalOrder.id,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//* Approve paypal order and update order to paid since in DB it is not paid
export async function approvePaypalOrder(
  orderId: string,
  data: { orderID: string },
) {
  try {
    const order = await prisma.order.findFirst({ where: { id: orderId } });

    if (!order) throw new Error("Order not found");

    const captureData = await paypal.capturePayment(data.orderID);//created by paypal that is the ID

    if (
      !captureData ||
      captureData.id !== /* Type casting identity */(order.PaymentResult as PaymentResult)?.id ||
      captureData.status !== "COMPLETED"
    ) {
      throw new Error("Error in paypal payment");
    }

    // Update the order to paid and use the data gotten from the paypal order
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        name: captureData.name,
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0].amount?.value,
      },
    });

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: "Your order has been paid",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// update the order to paid
async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  //Get the order from the DB
  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderitems: true, // use include cause tells Prisma to follow that relationship and fetch the related data
    },
  });
  if (!order) throw new Error("Order not found");

  if (order.isPaid) throw new Error("Order already paid");

  //Transaction to update order and account for product stock

  await prisma.$transaction(async (tx) => {
    //Iterate product and update the stock
    for (const item of order.orderitems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.qty } },
      });
    }

    //set the order to paid
    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        PaymentResult: paymentResult,
      },
    });
  });
  // Get update order to appear in UI after transaction
  const updatedOrder = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderitems: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!updatedOrder) throw new Error("Order not found");
}

//* Get all orders for a user with pagination
export async function getMyOrders({
  limit = PAGE_SIZE,
  page 
}:{
limit?: number;
page: number;
}){
const session = await auth();
if(!session) throw new Error('User not authenticated');
const data = await prisma.order.findMany({
  where: {
    userId: session?.user?.id
  },
  orderBy:{createdAt: 'desc'},
  take: limit,
  skip: (page - 1) * limit,//* or offset
})

const dataCount = await prisma.order.count({
  where: {
    userId: session?.user?.id
  }
});

return { data, totalPages: Math.ceil(dataCount / limit) };
}


type SalesDataType = {
  month: string;
  totalSales: number
}

// Get sales data and order summary
export async function getOrderSummary() {
  //Get count for each resource
  const orderCount = await prisma.order.count();
  const productCount = await prisma.product.count();
  const usersCount = await prisma.user.count();

  //Calculate the total sales
  const totalSales = await prisma.order.aggregate({
    _sum:{
      totalPrice: true
    }
  });
  //Get monthly sales
  //* to_char is the formated data
  const salesDataRaw = await prisma.$queryRaw<Array<{ month: string; totalSales: number }>>`
  SELECT 
    to_char("createdAt", 'MM/YY') AS "month",
    sum("totalPrice") AS "totalSales"
  FROM "Order"
  GROUP BY to_char("createdAt", 'MM/YY')
`;

const salesData: SalesDataType[] = salesDataRaw.map((entry)=> ({
  month: entry.month,
  totalSales: Number(entry.totalSales),
}))

  //Get latest sales
  const latestSales = await prisma.order.findMany({
    orderBy: {createdAt: 'desc'},
    include:{
      user: {select:{name: true}}
    },
    take: 6
  });

  return{ 
    orderCount,
    productCount,
    usersCount,
    totalSales,
    salesData,
    latestSales
  }
}