import type { Metadata } from "next";
import {notFound} from "next/navigation";
import { getUserById } from "@/lib/actions/user.actions";
import UpdateUserForm from "./update-user-form";

export const metadata: Metadata = {
  title: "Update User",
};
const AdminUserUpdatePage = async(props: { params: { id: string } }) => {
  const { id } = props.params;
    const user = await getUserById(id);
    if(!user) {
      notFound();
    }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
        <h1 className="h2-bold">Update Users</h1>
        <UpdateUserForm user={user} />
    </div>
  )
}

export default AdminUserUpdatePage