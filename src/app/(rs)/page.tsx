import sampleData from '../../../sample-data'
import ProductList from '@/components/shared/product/product-list'

export const metadata = {
  title: "Home",
}

 const Homepage = () => {
  // Simulate delay
  //await new Promise((resolve) => setTimeout(resolve, 3000))
  return <>
   <ProductList data={sampleData.products} title='newest' limit={4}/>
  </>
}

export default Homepage