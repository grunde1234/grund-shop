import { requireAdmin } from "@/lib/auth-guard";
import { getAllOrders } from "@/lib/actions/order.action";
import type { Metadata } from "next";
import { Table, TableHead, TableHeader, TableCell, TableBody, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import Pagination from "@/components/shared/pagination";
import { Link } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Orders",
};

const AdminOrdersPage = async (props: {
  searchParams: Promise<{ page: string }>;
}) => {
  await requireAdmin();
  const { page = '1' } = await props.searchParams;

  const orders = await getAllOrders({
    page: Number(page),
  });
  //* One page with 2 records as page = '1' and limit for records to display is 2
  /* const orders = await getAllOrders({
    page: Number(page),
    limit: 2
  }); */
  console.log(orders)  
  return  <div className="space-y-2">
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
    </div>;
};

export default AdminOrdersPage;
