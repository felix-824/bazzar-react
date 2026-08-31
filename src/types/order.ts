import type { Product } from './product'

export type OrderStatus = 'PAUSE' | 'PROCESS' | 'FINISH' | 'DELETE'

export interface OrderItem {
  _id: string
  itemQuantity: number
  itemPrice: number
  orderId: string
  productId: string
}

export interface Order {
  _id: string
  orderStatus: OrderStatus
  orderTotal?: number
  createdAt?: string
  updatedAt?: string
  orderItems: OrderItem[]
  productData: Product[]
}
