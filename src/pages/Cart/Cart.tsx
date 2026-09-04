import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import type { RootState } from '../../app/store'
import axiosInstance from '../../lib/axios'
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from '../../features/cart/cartSlice'
import './Cart.css'

const API_URL = 'http://localhost:3001'
const DELIVERY_FEE = 3000
type PaymentMethod = 'CASH' | 'CARD'

const paymentOptions: {
  value: PaymentMethod
  title: string
  subtitle: string
  icon: JSX.Element
}[] = [
  {
    value: 'CASH',
    title: 'Cash on Delivery',
    subtitle: 'Pay when your order arrives',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 8h14a2 2 0 0 1 2 2v8H6a2 2 0 0 1-2-2V8z" />
        <path d="M4 8V6a2 2 0 0 1 2-2h10v4" />
        <path d="M16 13h4" />
        <path d="M7 12h5" />
      </svg>
    ),
  },
  {
    value: 'CARD',
    title: 'Card Payment',
    subtitle: 'Visa / Mastercard',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h4" />
        <path d="M15 15h2" />
      </svg>
    ),
  },
]

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

function getErrorMessage(error: unknown) {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = error.response as {
      data?: {
        message?: string
        error?: string
      }
    }

    return (
      response.data?.message ||
      response.data?.error ||
      'Could not create order. Please check your cart and try again.'
    )
  }

  return 'Could not create order. Please try again.'
}

function Cart() {
  const dispatch = useDispatch()
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderMessage, setOrderMessage] = useState('')
  const [orderError, setOrderError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH')

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.productPrice * item.quantity,
    0
  )
  const total = subtotal + DELIVERY_FEE

  const handleProceedToOrder = async () => {
    if (cartItems.length === 0 || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setOrderMessage('')
    setOrderError('')

    const payload = {
      orderItems: cartItems.map((item) => ({
        productId: item.product._id,
        itemQuantity: item.quantity,
      })),
    }

    try {
      await axiosInstance.post('/order/create', payload)

      dispatch(clearCart())
      setOrderMessage('Order created successfully.')
    } catch (error) {
      console.log('Failed to create order:', error)
      setOrderError(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <section className="cart-empty">
          <h1>{orderMessage ? 'Order created' : 'Your cart is empty'}</h1>
          {orderMessage && (
            <p className="cart-success-message">{orderMessage}</p>
          )}
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
                  <span aria-hidden="true"></span>
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

          <section className="cart-payment" aria-labelledby="cart-payment-title">
            <h2 id="cart-payment-title">Payment Method</h2>

            <fieldset className="cart-payment-options">
              {paymentOptions.map((option) => (
                <label
                  className={
                    paymentMethod === option.value
                      ? 'cart-payment-option selected'
                      : 'cart-payment-option'
                  }
                  key={option.value}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.value}
                    checked={paymentMethod === option.value}
                    onChange={() => setPaymentMethod(option.value)}
                  />
                  <span className="cart-payment-icon">{option.icon}</span>
                  <span className="cart-payment-text">
                    <strong>{option.title}</strong>
                    <small>{option.subtitle}</small>
                  </span>
                </label>
              ))}
            </fieldset>
          </section>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleProceedToOrder}
          >
            {isSubmitting ? 'Creating Order...' : 'Proceed to Order'}
          </button>

          {orderError && <p className="cart-order-error">{orderError}</p>}
        </aside>
      </section>
    </main>
  )
}

export default Cart
