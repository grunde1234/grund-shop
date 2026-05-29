import type {Metadata} from "next"
import { getAllUsers } from "@/lib/actions/user.actions";
import { Table, TableHead, TableHeader, TableCell, TableBody, TableRow } from "@/components/ui/table";
import { formatDateTime, formatId } from "@/lib/utils";
import Pagination from "@/components/shared/pagination";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import DeleteDialog from "@/components/shared/delete-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteUser } from "@/lib/actions/user.actions";

export const metadata: Metadata = {
  title: "Users",
};

const AdminUserPage = async(props: { searchParams: Promise<{ page?: string, query: string }> }) => {
    const {page='1', query: searchText} = await props.searchParams;
    const users = await getAllUsers({page: Number(page), query: searchText});

  return (
     <div className="space-y-2">
         <h2 className="h2-bold">Users</h2>
         {searchText && (
            <div>
              &nbsp;Filtered by <i>&quot;{searchText}&quot;</i>{' '}
              <Link href="/admin/users" className="ml-2 text-sm">
                <Button>
                  Clear filter 
                </Button>
              </Link>
            </div>
          )}
         <div className="overflow-x-auto">
         <Table>
           <TableHeader>
             <TableRow>
               <TableHead>ID</TableHead>
               <TableHead>NAME</TableHead>
               <TableHead>EMAIL</TableHead>
               <TableHead>ROLE</TableHead>
               <TableHead>ACTIONS</TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             {users.data?.map((user) => (
               <TableRow key={user.id}>
                 <TableCell>{formatId(user.id)}</TableCell>
                 <TableCell>{user.name}</TableCell>
                 <TableCell>{user.email}</TableCell>
                 <TableCell>{user.role === 'user' ? <Badge variant="secondary">User</Badge> : <Badge variant="default">Admin</Badge>}</TableCell>
                 <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/users/${user.id}`}>Edit</Link>
                  </Button>
                   {/* DELETE */}
                   <DeleteDialog id={user.id} action={deleteUser.bind(null, user.id)} />
                 </TableCell>
               </TableRow>
             ))}
           </TableBody>
         </Table>
         {
           users.totalPages && users.totalPages > 1 && (<Pagination page={Number(page) || 1} totalPages={users.totalPages}></Pagination>)
         }
         </div>
       </div>
  )
}

export default AdminUserPage