import CartTable from "./cart-table"
import { getMyCart } from "@/lib/actions/cart.action"

export const metadata = {
    title: 'Cart'
}
const CartPage = async() => {
    const cart = await getMyCart();
  return (
    <div>
        <CartTable cart={cart ? { ...cart, itemPrice: cart.itemsPrice } : undefined} />
    </div>
  )
}

export default CartPage