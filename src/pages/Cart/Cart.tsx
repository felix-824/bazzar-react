import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import type { RootState } from '../../app/store'
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from '../../features/cart/cartSlice'
import './Cart.css'

const API_URL = 'http://localhost:3001'
const DELIVERY_FEE = 3000

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

function Cart() {
  const dispatch = useDispatch()
  const cartItems = useSelector((state: RootState) => state.cart.items)

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.productPrice * item.quantity,
    0
  )
  const total = subtotal + DELIVERY_FEE

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <section className="cart-empty">
          <h1>Your cart is empty</h1>
          <p>Add fresh groceries to your cart and come back here.</p>
          <Link to="/products">Continue Shopping</Link>
        </section>
      </main>
    )
  }

  return (
    <main className="cart-page">
      <section className="cart-panel">
        <h1>Your Cart</h1>

        <div className="cart-table">
          <div className="cart-row cart-header">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
            <span></span>
          </div>

          {cartItems.map((item) => {
            const imageUrl = getImageUrl(item.product.productImages?.[0])
            const itemTotal = item.product.productPrice * item.quantity

            return (
              <div className="cart-row" key={item.product._id}>
                <div className="cart-product">
                  <div className="cart-product-image">
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.product.productName} />
                    ) : (
                      <span>No image</span>
                    )}
                  </div>

                  <div>
                    <h3>{item.product.productName}</h3>
                    <p>
                      {item.product.productVolume}{' '}
                      {formatLabel(item.product.productUnit)}
                    </p>
                  </div>
                </div>

                <p className="cart-price">
                  {formatPrice(item.product.productPrice)}
                </p>

                <div className="cart-quantity">
                  <button
                    type="button"
                    onClick={() => dispatch(decreaseQuantity(item.product._id))}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => dispatch(increaseQuantity(item.product._id))}
                  >
                    +
                  </button>
                </div>

                <p className="cart-total">{formatPrice(itemTotal)}</p>

                <button
                  type="button"
                  className="cart-remove"
                  aria-label={`Remove ${item.product.productName}`}
                  onClick={() => dispatch(removeFromCart(item.product._id))}
                >
                  Remove
                </button>
              </div>
            )
          })}
        </div>

        <aside className="cart-summary">
          <div>
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>

          <div>
            <span>Delivery Fee</span>
            <strong>{formatPrice(DELIVERY_FEE)}</strong>
          </div>

          <div className="cart-summary-total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          <button type="button" disabled>
            Proceed to Order
          </button>
        </aside>
      </section>
    </main>
  )
}

export default Cart
