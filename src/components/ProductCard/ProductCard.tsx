import { Link } from 'react-router-dom'
import type { Product } from '../../types/product'
import './ProductCard.css'

interface ProductCardProps {
  product: Product
}

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

function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getImageUrl(product.productImages?.[0])

  return (
    <article className="product-card">
      <div className="product-card-image">
        {imageUrl ? (
          <img src={imageUrl} alt={product.productName} />
        ) : (
          <span>No image</span>
        )}
      </div>

      <div className="product-card-body">
        <p className="product-card-category">
          {formatLabel(product.productCollection)}
        </p>

        <h3>{product.productName}</h3>

        <p className="product-card-volume">
          {product.productVolume} {formatLabel(product.productUnit)}
        </p>

        <p className="product-card-price">
          {formatPrice(product.productPrice)}
        </p>

        <Link className="product-card-link" to={`/products/${product._id}`}>
          View Product
        </Link>
      </div>
    </article>
  )
}

export default ProductCard
