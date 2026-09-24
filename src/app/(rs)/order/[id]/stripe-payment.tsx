"use client"
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { FormEvent } from "react";
import { SERVER_URL } from "@/lib/constants";
type props = {
  priceInCents: number;
  orderId: string;
  clientSecret: string;
};

const StripePayment = ({ priceInCents, orderId, clientSecret }: props) => {
  const stripePromise = loadStripe(
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string  );
  const { theme, systemTheme } = useTheme();

  //Stripe Form component
  const StripeForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const [isloading, setIsloading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();

      if (stripe == null || elements == null) return;

      setIsloading(true);

      stripe
        .confirmPayment({//* Reads the payment details from the PaymentElement and confirms the payment with Stripe before redirecting the user to the return_url.
          elements,
          confirmParams: {
            return_url: `${SERVER_URL}/order/${orderId}/stripe-payment-success`,
          },
        })
        .then(({ error }) => {
          if (
            error?.type === "card_error" ||
            error?.type === "validation_error"
          ) {
            setErrorMessage(error?.message || "An unknown error occurred");
          } else if (error) {
            setErrorMessage("An unknown error occurred");
          }
        })
        .finally(() => setIsloading(false));
    };

    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="text-xl">Stripe Checkout</div>
        {errorMessage && <div className="text-destructive">{errorMessage}</div>}
        <PaymentElement />{/* This is an element that allows the user to enter their payment details */}
        <div>
          <LinkAuthenticationElement
            onChange={(e) => setEmail(e.value.email)}
          />
        </div>
        <Button
          className="w-full"
          size="lg"
          disabled={stripe == null || elements == null || isloading}
        >
          {isloading
            ? "Purchasing..."
            : `Purchase ${formatCurrency(priceInCents / 100)}`}
        </Button>
      </form>
    );
  };

  return (
    <Elements
      options={{
        clientSecret,
        appearance: {
          theme:
            theme === "dark"
              ? "night"
              : theme === "light"
                ? "stripe"
                : systemTheme === "light"
                  ? "stripe"
                  : "night",
        },
      }}
      stripe={stripePromise}
    >
      <StripeForm></StripeForm>
    </Elements>
  );
};

export default StripePayment;
