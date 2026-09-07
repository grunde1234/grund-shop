import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getAllCategories } from "@/lib/actions/product.actions";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

const CategoryDrawer = async () => {
  const categories = await getAllCategories();

  if (!categories.success) {
    console.error("Failed to load categories:", categories.message);
    return null;
  }

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline" aria-label="Browse categories">
          <MenuIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Select a Category</DrawerTitle>
          <DrawerDescription className="sr-only">
            Browse products by category
          </DrawerDescription>
          <div className="space-y-1">
            {categories.data.map((x) => (
              <Button
                key={x.category}
                variant="ghost"
                className="w-full justify-start"
                asChild
              >
                <DrawerClose asChild>
                  <Link href={`/search?category=${encodeURIComponent(x.category)}`}>
                    {x.category} ({x._count})
                  </Link>
                </DrawerClose>
              </Button>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default CategoryDrawer;