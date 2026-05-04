import { Table, TableHeader, TableRow, TableCell, TableHead, TableBody } from "@/components/ui/table"
import { getMyOrders } from "@/lib/actions/order.action"
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils"
import Pagination from "@/components/shared/pagination"
import Link from "next/link"
import {requireAdmin} from "@/lib/auth-guard"

export const metadata = {
  title: 'My Orders'
}
const OrderPage = async (props: {
  searchParams: Promise<{page: string}>
}) => {

  await requireAdmin()
  const {page} = await props.searchParams;


  const orders = await getMyOrders({
    page: Number(page) || 1
  });

  return (
    <div className="space-y-2">
      <h2 className="h2-bold">Orders</h2>
      <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Paid</TableHead>
            <TableHead>Delivered</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.data.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{formatId(order.id)}</TableCell>
              <TableCell>{formatDateTime(order.createdAt).dateTime}</TableCell>
              <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
              <TableCell>{order.isPaid && order.paidAt ? formatDateTime(order.paidAt).dateTime : 'Not Paid For'}</TableCell>
              <TableCell>{order.isDelivered && order.deliveredAt ? formatDateTime(order.deliveredAt).dateTime : 'Not Delivered'}</TableCell>
              <TableCell>
                <Link href={`/order/${order.id}`}><span className="px-2">Details</span></Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {
        orders.totalPages > 1 && (<Pagination page={Number(page) || 1} totalPages={orders?.totalPages}></Pagination>)
      }
      </div>
    </div>
  )
}

export default OrderPage