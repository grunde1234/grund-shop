import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { getAllCategories } from "@/lib/actions/product.actions"

const CategoryDrawer = async() => {
  const categories = await getAllCategories();

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
      <Button variant='outline'>
        
      </Button>
      </DrawerTrigger>
    </Drawer>
  )
}

export default CategoryDrawer