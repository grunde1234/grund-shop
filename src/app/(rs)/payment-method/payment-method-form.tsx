"use client"
import React from 'react'
import {useTransition } from "react"
import { useRouter } from 'next/navigation'
import {paymentMethodSchema} from '@/lib/validators'
import {toast} from 'sonner'
import {useForm} from 'react-hook-form'
import {Button} from '@/components/ui/button'
import {Loader, ArrowRight} from 'lucide-react'
import { Input } from "@/components/ui/input"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {updateUserPaymentMethod} from '@/lib/actions/user.actions'
import {
 Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,} from '@/components/ui/form' 
import {z} from 'zod'
import {/* DEFUALT_PAYMENT_METHOD */ PAYMENT_METHODS} from '@/lib/constants/index'
import {zodResolver/* SubmitHandler */} from '@hookform/resolvers/zod'

const PaymentMethodForm = ({preferredPaymentMethod}: {preferredPaymentMethod: string | null}) => {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();


    const defaultValues:z.infer<typeof paymentMethodSchema> = {
    type: 'PayPal'/* DEFUALT_PAYMENT_METHOD */
    }

    const form = useForm<z.infer<typeof paymentMethodSchema>>({
        resolver: zodResolver(paymentMethodSchema),
        mode: 'onBlur',
        defaultValues,
    })

    const submitForm = (data: z.infer<typeof paymentMethodSchema>)=>{
        startTransition(async()=>{
        const res = await updateUserPaymentMethod(data)

        if (!res.success) {
        toast.error(res.message);
       return;
    }

    router.push("/place-order");
        })
    }

  return (
    <div className="max-w-md mx-auto space-y-4">
            <h2 className="h2-bold mt-4">Payment Method</h2>
            <p className="text-sm text-muted-foreground">
            Please select payment method
            </p>
        <Form {...form}>
            {/* what is the use of method='post when we already have onSubmit' */}
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-4">
            {/* FULL NAME */}
            <div className="flex flex-col gap-5 md:flex-row">
                {/* RADIO */}
                <FormField 
                control={form.control}
                name="type"
                render={({field})=>(
                    <FormItem className="space-y-3">
                    <FormControl>
                    <RadioGroup onValueChange={field.onChange} className='flex flex-col space-y-2'>
                        {PAYMENT_METHODS.map((paymentMethod)=> (<FormItem key={paymentMethod} className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                            <RadioGroupItem value={paymentMethod} checked={field.value === paymentMethod} />

                        
                        </FormControl>
                        <FormLabel className='font-normal'>
                            {paymentMethod}
                        </FormLabel>
                       </FormItem>))}
                    </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
                />
            </div>

            <div className="flex gap-2">
                <Button type="submit" disabled={isPending}>
                {
                    isPending ? (<Loader className="w-4 h-4 animate-spin"/>) : (<ArrowRight className="w-4 h-4"/>)
                }Continue
                </Button>
            </div>
        </form>
    </Form>
    </div>
  )
}

export default PaymentMethodForm