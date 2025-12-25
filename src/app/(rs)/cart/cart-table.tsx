'use client'

import {Cart } from "@/Zod-schemas";
import { useRouter } from "next/navigation";
import {toast} from 'sonner';
import {useTransition} from 'react'
import {addItemToCart, removeItemFromCart} from '@/lib/actions/cart.action'
import {ArrowRight, Loader, Plus, Minus} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {Button} from '@/components/ui/button'
import {
    Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const CartTable = ({cart}: {cart?: Cart}) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition()
  return (
    <div>
        <h1>
            <p className="py-4 h2-bold">
                Shopping Cart
            </p>
            {!cart || cart.items.length === 0 ? (
                <div>
                    Cart is empty. <Link href='/'>Go Shopping</Link>
                </div>
            ) : (
                //JSON.stringify(cart)
                <div className="grid md:grid-cols-4 md:gap-5">
                    <div className="overflow-x-auto md:col-span-3">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead className="text-center">Quantity</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cart.items.map((item=> (
                            <TableRow key={item.slug}>
                                <TableCell>
                                    <Link href={`/product/${item.slug}`} className="flex items-center">
                                    <Image src={item.image} alt={item.name} width={50} height={50}/>
                                    <span className="px-2">
                                        {item.name}
                                    </span>
                                    </Link>
                                </TableCell>

                                <TableCell className="flex-center gap-2">
                                    <Button disabled={isPending} variant = 'outline' type = 'button' onClick={()=> startTransition(async()=>{
                                        const res = await removeItemFromCart(item.productId)

                                        if(!res.success){
                                            toast.error(res.message)
                                        }
                                    })}>
                                        {isPending ? (<Loader className='w-4 h-4 animate-spin'/>) : (<Minus className='w-4 h-4'/>)}
                                    </Button>
                                    <span>{item.qty}</span>
                                     <Button disabled={isPending} variant = 'outline' type = 'button' onClick={()=> startTransition(async()=>{
                                        const res = await addItemToCart(item)

                                        if(!res.success){
                                            toast.error(res.message)
                                        }
                                    })}>
                                        {isPending ? (<Loader className='w-4 h-4 animate-spin'/>) : (<Plus className='w-4 h-4'/>)}
                                    </Button>
                                </TableCell>

                                <TableCell className="text-right">
                                    ${item.price}
                                </TableCell>
                            </TableRow>

                            )))}
                        </TableBody>
                    </Table>
                    </div>
                </div>
            )}
        </h1>
    </div>
  )
}

export default CartTable