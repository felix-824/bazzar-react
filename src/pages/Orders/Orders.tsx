import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AxiosError } from 'axios'

import type { RootState } from '../../app/store'
import axiosInstance from '../../lib/axios'
import type { Order, OrderStatus } from '../../types/order'
import './Orders.css'

const API_URL = 'http://localhost:3001'

const statusLabels: Record<OrderStatus, string> = {
  PAUSE: 'Pending',
  PROCESS: 'Processing',
  FINISH: 'Completed',
  DELETE: 'Cancelled',
}

function formatPrice(price?: number) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(price || 0)
}

function formatOrderDate(date?: string) {
  if (!date) {
    return 'Date unavailable'
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Date unavailable'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(parsedDate)
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
  if (error instanceof AxiosError) {
    const data = error.response?.data

    if (typeof data === 'object' && data !== null) {
      const responseData = data as { message?: string; error?: string }

      return responseData.message || responseData.error || 'Could not load orders.'
    }
  }

  return 'Could not load orders. Please try again.'
}

function getOrdersFromResponse(data: unknown): Order[] {
  if (Array.isArray(data)) {
    return data as Order[]
  }

  if (typeof data === 'object' && data !== null && 'orders' in data) {
    const responseData = data as { orders?: Order[] }

    return responseData.orders || []
  }

  return []
}

function getOrderTotal(order: Order) {
  if (order.orderTotal !== undefined) {
    return order.orderTotal
  }

  return order.orderItems.reduce(
    (total, item) => total + item.itemPrice * item.itemQuantity,
    0
  )
}

function Orders() {
  const member = useSelector((state: RootState) => state.auth.member)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState('')

  const fetchOrders = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await axiosInstance.get('/order/all')

      setOrders(getOrdersFromResponse(response.data))
    } catch (error) {
      console.log('Failed to load orders:', error)
      setError(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!member) {
      setIsLoading(false)
      return
    }

    fetchOrders()
  }, [member])

  const handleCancelOrder = async (orderId: string) => {
    if (cancellingId) {
      return
    }

    setCancellingId(orderId)
    setError('')

    try {
      await axiosInstance.post(`/order/cancel/${orderId}`)

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: 'DELETE' } : order
        )
      )
    } catch (error) {
      console.log('Failed to cancel order:', error)
      setError(getErrorMessage(error))
    } finally {
      setCancellingId('')
    }
  }

  if (!member) {
    return (
      <main className="orders-page">
        <section className="orders-message-card">
          <h1>My Orders</h1>
          <p>Please login to view your orders.</p>
          <Link to="/login">Login</Link>
        </section>
      </main>
    )
  }

  return (
    <main className="orders-page">
      <section className="orders-panel">
        <h1>My Orders</h1>

        {isLoading ? (
          <p className="orders-message">Loading your orders...</p>
        ) : error ? (
          <p className="orders-message orders-error">{error}</p>
        ) : orders.length === 0 ? (
          <div className="orders-empty">
            <p>You don&apos;t have any orders yet.</p>
            <Link to="/products">Shop Products</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              return (
                <article className="order-card" key={order._id}>
                  <div className="order-card-top">
                    <div>
                      <h2>Order #{order._id.slice(-8).toUpperCase()}</h2>
                      <p>{formatOrderDate(order.createdAt || order.updatedAt)}</p>
                    </div>

                    <span className={`order-status ${order.orderStatus.toLowerCase()}`}>
                      {statusLabels[order.orderStatus]}
                    </span>
                  </div>

                  <div className="order-card-body">
                    <div className="order-products">
                      {order.orderItems.length > 0 ? (
                        order.orderItems.map((item) => {
                          const product = order.productData.find(
                            (product) => product._id === item.productId
                          )
                          const imageUrl = getImageUrl(product?.productImages?.[0])

                          return (
                            <div className="order-product" key={item._id}>
                              <div className="order-product-image">
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={product?.productName || 'Order product'}
                                  />
                                ) : (
                                  <span>No image</span>
                                )}
                              </div>

                              <div>
                                <h3>{product?.productName || 'Product unavailable'}</h3>
                                <p>Qty: {item.itemQuantity}</p>
                                <p>{formatPrice(item.itemPrice)}</p>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <p className="orders-message">No product details available.</p>
                      )}
                    </div>

                    <div className="order-total-box">
                      <span>Total</span>
                      <strong>{formatPrice(getOrderTotal(order))}</strong>

                      {order.orderStatus === 'PAUSE' && (
                        <button
                          type="button"
                          disabled={cancellingId === order._id}
                          onClick={() => handleCancelOrder(order._id)}
                        >
                          {cancellingId === order._id
                            ? 'Cancelling...'
                            : 'Cancel Order'}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}

export default Orders
