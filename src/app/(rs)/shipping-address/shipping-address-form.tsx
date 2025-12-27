'use client'

import {ShippingAddress} from '@/Zod-schemas'
import {useRouter} from 'next/navigation'
import {toast} from 'sonner'
import {useTransition} from 'react'
import {Loader, ArrowRight} from 'lucide-react'
import {shippingAddressSchema} from '@/lib/validators'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm, ControllerRenderProps} from 'react-hook-form'
import {
 Form,
 FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,} from '@/components/ui/form'
import { Input } from "@/components/ui/input"
import {Button} from '@/components/ui/button'

type props = {
    address?: ShippingAddress,
};

const ShippingAddressForm = ({address}: props) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const defaultValues:ShippingAddress ={
    fullName: address?.fullName ?? "John Doe",
    streetAddress: address?.streetAddress ?? "123 Main St",
    city: address?.city ?? "Dubai",
    postalCode: address?.postalCode ?? "123456",
    country: address?.country ?? "USA",
    lat: address?.lat ?? 0,
    lng: address?.lng ?? 0,
    }

    const form = useForm<ShippingAddress>({
        mode: 'onBlur',
        resolver: zodResolver(shippingAddressSchema),
        defaultValues
    })

    async function submitForm(data:ShippingAddress){
        console.log(data)
    }

  return (
    <div className="max-w-md mx-auto space-y-4">
            <h2 className="h2-bold mt-4">Shipping Address</h2>
            <p className="text-sm text-muted-foreground">
            Please enter an address to ship to
            </p>
        <Form {...form}>
            {/* what is the use of method='post when we already have onSubmit' */}
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-4">
            {/* FULL NAME */}
            <div className="flex flex-col gap-5 md:flex-row">
                 <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
                <FormItem className='w-full'>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                    <Input placeholder="Please enter your full name" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            </div>

            {/* ADDRESS */}
            <div className="flex flex-col gap-5 md:flex-row">
                 <FormField
            control={form.control}
            name="streetAddress"
            render={({ field }) => (
                <FormItem className='w-full'>
                <FormLabel>Address</FormLabel>
                <FormControl>
                    <Input placeholder="Please enter your Address" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            </div>

            {/* CITY */}
            <div className="flex flex-col gap-5 md:flex-row">
                 <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
                <FormItem className='w-full'>
                <FormLabel>City</FormLabel>
                <FormControl>
                    <Input placeholder="Please enter your city" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            </div>

            {/* postalCode */}
            <div className="flex flex-col gap-5 md:flex-row">
                 <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
                <FormItem className='w-full'>
                <FormLabel>Postal code</FormLabel>
                <FormControl>
                    <Input placeholder="Please enter your postal code" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            </div>
            {/* COUNTRY */}
            <div className="flex flex-col gap-5 md:flex-row">
                 <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
                <FormItem className='w-full'>
                <FormLabel>Country</FormLabel>
                <FormControl>
                    <Input placeholder="Please enter your country" {...field} />
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

export default ShippingAddressForm