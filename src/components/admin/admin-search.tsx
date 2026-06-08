'use client'
import { usePathname, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";

export default function AdminSearch() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const formActionUrl = pathname.includes('/admin/order')
    ? '/admin/order'
    : pathname.includes('/admin/usersz')
    ? '/admin/users'
    : '/admin/products';

  return (
    <form action={formActionUrl} method="GET">
      <Input
        type="search"
        placeholder="Search..."
        name="query"
        defaultValue={searchParams.get('query') ?? ''}
        className="md:w-[100px] lg:w-[300px]"
      />
      <button className="sr-only" type="submit">Search</button>
    </form>
  );
}