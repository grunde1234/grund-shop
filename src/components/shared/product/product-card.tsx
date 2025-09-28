import Link from "next/link"
import Image from "next/image"
import { Card,
  CardContent,
  CardHeader,
 } from "@/components/ui/card"
 import ProductPrice from "./product-price"

type Props ={
    product: any
}
const ProductCard = ({product}: props) => {
  return (
    <Card className="w-full max-w-sm">
    <CardHeader className="p-0 items-center">
        <Link href={`/product/${product.slug}`} className="mx-auto">
        <Image src={product.images[0]} alt={product.name} height={300} width={500} priority={true} />
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <div className="text-xs">
            {product.brand}
        </div>
        <Link href={`/product/${product.slug}`}>
        <h1 className="text-sm font-medium"> {product.name} </h1>
        </Link>
        <div className="flex-between gap-4">
        <p>{product.rating} Stars</p>
        {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} className="" />
        ) : (
            <p className="text-destructive">
                Out of stock
            </p>
        )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductCard