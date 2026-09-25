import { getOrderById } from "@/lib/actions/order.action";
import { notFound, redirect } from "next/navigation";
import Stripe from "stripe"
import { Button } from "@/components/ui/button";
import Link from "next/link";

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const Successpage = async(props: {
    params: Promise<{id: string}>;
    searchParams: Promise<{payment_intent: string;}>;
}) => {

    const {id} = await props.params;
    const {payment_intent: paymentIntentId} = await props.searchParams;


    //Fetch order
    const order = await getOrderById(id);
    if(!order) notFound();

    //Retrieve the paymentIntent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    //Check if the payment intent is valid

    if(paymentIntent.metadata.orderId === null || paymentIntent.metadata.orderId !== order.id){
        return notFound();
    }

    //Check if the payment is successfull
    const isSuccess = paymentIntent.status === 'succeeded';
    if(!isSuccess) return redirect(`/order/${id}`)

  return (
    <div className="max-w-4xl w-full mx-auto space-y-8">
        <div className="flex flex-col gap-6 items-center">
            <h1 className="h1-bold">Thanks for your purchase</h1>
            <div>We are processing your order.</div>
            <Button asChild>
            <Link href={`/order/${id}`}>View Order</Link>
            </Button>
        </div>
    </div>
  )
}

export default Successpage