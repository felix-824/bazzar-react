import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'

import { addToCart } from '../../features/cart/cartSlice'
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
  const dispatch = useDispatch()
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/product/${id}`)

        setProduct(response.data)
        setSelectedImage(response.data.productImages?.[0] || '')
        setQuantity(1)
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

  const productImages = product.productImages.filter(Boolean)
  const imageUrl = getImageUrl(selectedImage || productImages[0])
  const canIncreaseQuantity = quantity < product.productLeftCount
  const canAddToCart = product.productLeftCount > 0

  const handleDecreaseQuantity = () => {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1))
  }

  const handleIncreaseQuantity = () => {
    setQuantity((currentQuantity) =>
      Math.min(product.productLeftCount, currentQuantity + 1)
    )
  }

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }))
  }

  return (
    <main className="product-detail-page">
      <Link className="product-detail-back" to="/products">
        &larr; Back to Products
      </Link>

      <section className="product-detail">
        <div className="product-detail-gallery">
          <div className="product-detail-image">
            {imageUrl ? (
              <img src={imageUrl} alt={product.productName} />
            ) : (
              <span>No image</span>
            )}
          </div>

          {productImages.length > 1 && (
            <div className="product-detail-thumbnails">
              {productImages.map((image) => (
                <button
                  key={image}
                  type="button"
                  className={
                    selectedImage === image
                      ? 'product-detail-thumb active'
                      : 'product-detail-thumb'
                  }
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={getImageUrl(image)}
                    alt={`${product.productName} thumbnail`}
                  />
                </button>
              ))}
            </div>
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
            <div>
              <span>Volume</span>
              <strong>
                {product.productVolume} {formatLabel(product.productUnit)}
              </strong>
            </div>

            <div>
              <span>Available</span>
              <strong>{product.productLeftCount}</strong>
            </div>
          </div>

          {product.productDesc && (
            <p className="product-detail-desc">{product.productDesc}</p>
          )}

          <div className="product-detail-actions">
            <div className="product-detail-quantity">
              <button
                type="button"
                disabled={quantity <= 1 || !canAddToCart}
                onClick={handleDecreaseQuantity}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                disabled={!canIncreaseQuantity || !canAddToCart}
                onClick={handleIncreaseQuantity}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="product-detail-cart-btn"
              disabled={!canAddToCart}
              onClick={handleAddToCart}
            >
              {canAddToCart ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ProductDetail
