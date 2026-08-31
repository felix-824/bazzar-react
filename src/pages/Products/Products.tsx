import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import axiosInstance from '../../lib/axios'
import { setProducts } from '../../features/products/productSlice'
import type { RootState } from '../../app/store'
import ProductCard from '../../components/ProductCard/ProductCard'
import './Products.css'

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

  return (
    <main className="products-page">
      <div className="products-header">
        <p>Fresh Products</p>
        <h1>Shop groceries from Bazzar</h1>
      </div>

      {products.length > 0 ? (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="products-empty">No products found.</p>
      )}
    </main>
  )
}

export default Products
