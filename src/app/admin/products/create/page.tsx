import type { Metadata } from "next"
import ProductForm from "@/components/admin/product-form"

export const metadata: Metadata = {
    title: 'Create Product'
}

const CreateProductPage = () => {
  return (
    <>
    <h2 className="h2-bold">Create Product</h2>
    <div className="my-8">
      {/* FORM */}
      <ProductForm type='Create'/>{/* Type is included because the component is for creating and updating a product */}
    </div>
    </>
  )
}

export default CreateProductPage