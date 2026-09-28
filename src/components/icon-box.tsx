import { DollarSign, Headset, ShoppingBag, WalletCards } from "lucide-react"
import { Card, CardContent } from "./ui/card"

const IconBox = () => {
  return (
    <div>
    <Card>
        <CardContent className="grid md:grid-cols-4 gap-4 p-4">
            <div className="space-y-2">
                <ShoppingBag />
                <div className="text-sm font-bold">
                    Free Shipping
                </div>
                <div className="text-sm text-muted-foreground">
                    Free Shipping on orders above $100
                </div>
            </div>
            <div className="space-y-2">
                <DollarSign />
                <div className="text-sm font-bold">
                    Money Back Guarantee
                </div>
                <div className="text-sm text-muted-foreground">
                    30-Day Money Back Guarantee
                </div>
            </div>
            <div className="space-y-2">
                <WalletCards />
                <div className="text-sm font-bold">
                    Flexible Payment Options
                </div>
                <div className="text-sm text-muted-foreground">
                    Pay with Credit Card, PayPal, Stripe or COD
                </div>
            </div>
            <div className="space-y-2">
                <Headset />
                <div className="text-sm font-bold">
                    24/7 Customer Support
                </div>
                <div className="text-sm text-muted-foreground">
                    Get help anytime, anywhere
                </div>
            </div>
        </CardContent>
    </Card>
    </div>
  )
}

export default IconBox