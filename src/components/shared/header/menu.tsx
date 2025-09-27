import { ModeToggle } from "@/components/shared/ModeToggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, UserIcon, EllipsisVertical } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetTitle,
  SheetContent,
  SheetDescription,
} from "@/components/ui/sheet";

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />
        <Button variant="ghost" aria-label="" asChild>
          <Link href="/cart">
            <ShoppingCart />
            Cart
          </Link>
        </Button>

        <Button variant="ghost" aria-label="" asChild>
          <Link href="/sign-in">
            <UserIcon />
            Sign in
          </Link>
        </Button>
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle className="pt-3 pl-2">Menu</SheetTitle>
            <ModeToggle />
            <Button asChild variant="ghost">
              <Link href="/cart">
                <ShoppingCart />
              </Link>
            </Button>
            <Button variant="ghost" aria-label="" asChild>
              <Link href="/sign-in">
                <UserIcon />
                Sign in
              </Link>
            </Button>
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
