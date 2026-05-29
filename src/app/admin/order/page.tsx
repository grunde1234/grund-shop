
import { requireAdmin } from "@/lib/auth-guard";
import { deleteAdminOrder, getAllOrders } from "@/lib/actions/order.action";
import type { Metadata } from "next";
import { Table, TableHead, TableHeader, TableCell, TableBody, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import Pagination from "@/components/shared/pagination";
import Link from "next/link";
import DeleteDialog from "@/components/shared/delete-dialog";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin Orders",
};

const AdminOrdersPage = async (props: {
  searchParams: Promise<{ page: string; query: string;  category: string }>;
}) => {
  await requireAdmin();
  const { page = '1', query:searchText, category = '' } = await props.searchParams;

  const orders = await getAllOrders({
    page: Number(page),
    query: searchText,
    category
  });
  //* One page with 2 records as page = '1' and limit for records to display is 2
  /* const orders = await getAllOrders({
    page: Number(page),
    limit: 2
  }); */
  console.log(orders)  
  return  <div className="space-y-2">
      <h2 className="h2-bold">Orders</h2>
      {
        searchText && (
          <div>
            &nbsp;Filtered by <i>&quot;{searchText}&quot;</i>{' '}
            <Link href="/admin/order" className="ml-2 text-sm">
              <Button>
                Clear filter
              </Button>
            </Link>
          </div>
        )
      }
      <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Buyer</TableHead>
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
              <TableCell>{order.user.name}</TableCell>
              <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
              <TableCell>{order.isPaid && order.paidAt ? formatDateTime(order.paidAt).dateTime : 'Not Paid For'}</TableCell>
              <TableCell>{order.isDelivered && order.deliveredAt ? formatDateTime(order.deliveredAt).dateTime : 'Not Delivered'}</TableCell>
              <TableCell>
                <Link href={`/order/${order.id}`}><span className="px-2">DETAILS</span></Link>
                {/* DELETE */}
                <DeleteDialog id={order.id} action={deleteAdminOrder.bind(null, { orderId: order.id })} />
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
