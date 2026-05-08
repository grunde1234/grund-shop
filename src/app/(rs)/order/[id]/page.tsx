export const metadata = {
  title: 'Order Details',
  description: 'Order details page',
}

import { getOrderById } from "@/lib/actions/order.action"
import { notFound } from "next/navigation"
import OrderDetailsTable from './order-details-table'
import { ShippingAddress } from "@/Zod-schemas"
import { auth } from "../../../../../auth"


const OrderDetailsPage = async(props: {
    params: Promise<{ id: string }>
}) => {
    const { id } = await props.params;

    const order = await getOrderById(id);

    if(!order){
        notFound();
    }

    const session = await auth();


  return (
    <OrderDetailsTable order={{/* like this cause it has to resemble the model object for shipping */
        ...order,
        itemsPrice: order.itemsPrice.toString(),
        shippingPrice: order.shippingPrice.toString(),
        taxPrice: order.taxPrice.toString(),
        totalPrice: order.totalPrice.toString(),
        shippingAddress: order.shippingAddress as ShippingAddress
    }} PaypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
        isAdmin={session?.user?.role === 'admin' || false} />
  )
}

export default OrderDetailsPage