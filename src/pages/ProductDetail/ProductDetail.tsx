import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import axiosInstance from '../../lib/axios'
import type { Product } from '../../types/product'
import './ProductDetail.css'

const API_URL = 'http://localhost:3001'

function formatPrice(price: number) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(price)
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function getImageUrl(image?: string) {
  if (!image) {
    return ''
  }

  if (image.startsWith('http')) {
    return image
  }

  if (image.startsWith('/')) {
    return `${API_URL}${image}`
  }

  return `${API_URL}/${image}`
}

function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/product/${id}`)

        setProduct(response.data)
      } catch (error) {
        console.log('Failed to fetch product:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!id) {
      setIsLoading(false)
      return
    }

    fetchProduct()
  }, [id])

  if (isLoading) {
    return (
      <main className="product-detail-page">
        <p className="product-detail-message">Loading product...</p>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="product-detail-page">
        <p className="product-detail-message">Product not found.</p>
        <Link className="product-detail-back" to="/products">
          Back to Products
        </Link>
      </main>
    )
  }

  const imageUrl = getImageUrl(product.productImages?.[0])

  return (
    <main className="product-detail-page">
      <Link className="product-detail-back" to="/products">
        Back to Products
      </Link>

      <section className="product-detail">
        <div className="product-detail-image">
          {imageUrl ? (
            <img src={imageUrl} alt={product.productName} />
          ) : (
            <span>No image</span>
          )}
        </div>

        <div className="product-detail-info">
          <p className="product-detail-category">
            {formatLabel(product.productCollection)}
          </p>

          <h1>{product.productName}</h1>

          <p className="product-detail-price">
            {formatPrice(product.productPrice)}
          </p>

          <div className="product-detail-meta">
            <p>
              <strong>Volume:</strong> {product.productVolume}{' '}
              {formatLabel(product.productUnit)}
            </p>

            <p>
              <strong>Available:</strong> {product.productLeftCount}
            </p>
          </div>

          {product.productDesc && (
            <p className="product-detail-desc">{product.productDesc}</p>
          )}
        </div>
      </section>
    </main>
  )
}

export default ProductDetail
