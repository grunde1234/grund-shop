"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { CartItem } from "@/Zod-schemas";
import { toast } from "sonner";
import { addItemToCart } from "@/lib/actions/cart.action";

const AddToCart = ({ item }: { item: CartItem }) => {
  const router = useRouter();
  //add to the cart and get a response
  const handleAddToCart = async () => {
    const res = await addItemToCart(item);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    //For success in this
    toast.success(res.message, {
      action: {
        label: "Go to cart",
        onClick: () => {
          router.push("/cart");
        },
      }
    });
  };
  return (
    <Button className="w-full cursor-pointer" type="button" onClick={handleAddToCart}>
      <Plus /> Add To Cart
    </Button>
  );
};

export default AddToCart;
