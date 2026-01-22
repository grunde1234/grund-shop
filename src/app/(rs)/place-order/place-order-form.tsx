'use client'

import { useFormStatus } from "react-dom"
import {createOrder} from '@/lib/actions/order.action'
import { Check,Loader } from "lucide-react"
import { Button } from '@/components/ui/button'
import { useRouter } from "next/navigation"
import { Form } from "react-hook-form"

const PlaceOrderForm = () => {
    const router = useRouter();

    const submitForm = async(event: React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        const res = await createOrder();

        if(res.redirectTo){
            router.push(res.redirectTo);
            return;
        }
    }

    const PlaceOrderButton = () => {
        const { pending } = useFormStatus();
        return (
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}{' '}Place Order
          </Button>
        );
    }
  return (
    <form className="w-full" onSubmit={submitForm}>
        <PlaceOrderButton/>
    </form>
  )
}

export default PlaceOrderForm