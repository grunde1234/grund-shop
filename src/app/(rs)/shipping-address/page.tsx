import { auth } from "../../../../auth"
import {getMyCart} from '@/lib/actions/cart.action'
import {getUserById} from '@/lib/actions/user.actions'
import {redirect} from 'next/navigation'
import {ShippingAddress} from '@/Zod-schemas'
import ShippingAddressForm from './shipping-address-form' 

export const metadata = {
    title: 'Shipping Address'
}
const ShippingAddressPage = async() => {
    const cart = await getMyCart()

    if(!cart || cart.items.length === 0) redirect('/cart');

    const session = await auth()
    const userId = session?.user?.id;
    if(!userId) throw new Error('No user ID');

    //So we get the user from DB using user in session
    const user = await getUserById(userId)
  return (
    <>
    <ShippingAddressForm address={user.address as ShippingAddress} />
    </>
  )
}

export default ShippingAddressPage