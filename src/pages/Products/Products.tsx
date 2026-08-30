import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import axiosInstance from '../../lib/axios'
import { setProducts } from '../../features/products/productSlice'
import type { RootState } from '../../app/store'

function Products() {
  const dispatch = useDispatch()

  const products = useSelector(
    (state: RootState) => state.products.products
  )

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/products')

        dispatch(setProducts(response.data))
      } catch (error) {
        console.log('Failed to fetch products:', error)
      }
    }

    fetchProducts()
  }, [dispatch])

  console.log('Redux products:', products)

  return (
    <div>
      <h1>Products</h1>

      {products.map((product) => (
        <p key={product._id}>
          {product.productName} - {product.productPrice} KRW
        </p>
      ))}
    </div>
  )
}

export default Products