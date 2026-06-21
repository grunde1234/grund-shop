/* import sampleData from '../../../sample-data'
 */
import ProductList from '@/components/shared/product/product-list'
import { getLatestProducts, getFeaturedProducts } from '@/lib/actions/product.actions'
import ProductCarousel from '@/components/shared/product/product-carousel'

export const metadata = {
  title: "Home",
}

 const Homepage = async () => {

  const latestProducts = await getLatestProducts();
  const featureProducts = await getFeaturedProducts();
  // Simulate delay
  //await new Promise((resolve) => setTimeout(resolve, 3000))
  return <>
  {featureProducts.length > 0 && <ProductCarousel data={featureProducts}/>}
   <ProductList data={latestProducts} title='newest'/>
  </>
}

export default Homepage