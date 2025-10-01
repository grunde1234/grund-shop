/* import sampleData from '../../../sample-data'
 */
import ProductList from '@/components/shared/product/product-list'
import { getLatestProducts } from '@/lib/actions/product.actions'

export const metadata = {
  title: "Home",
}

 const Homepage = async () => {

  const latestProducts = await getLatestProducts();
  // Simulate delay
  //await new Promise((resolve) => setTimeout(resolve, 3000))
  return <>
   <ProductList data={latestProducts} title='newest'/>
  </>
}

export default Homepage