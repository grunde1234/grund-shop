type props = {
    priceInCents: number,
    orderId: string,
    client_secret: string
}


const StripePayment = ({priceInCents, orderId, client_secret}: props) => {
  return (
    <div>StripePayment</div>
  )
}

export default StripePayment