import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '../../types/product'

interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
}

interface AddToCartPayload {
  product: Product
  quantity?: number
}

const initialState: CartState = {
  items: [],
}

function isAddToCartPayload(
  value: Product | AddToCartPayload
): value is AddToCartPayload {
  return 'product' in value
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product | AddToCartPayload>) => {
      const payload = action.payload
      const product = isAddToCartPayload(payload) ? payload.product : payload
      const requestedQuantity = isAddToCartPayload(payload)
        ? payload.quantity || 1
        : 1
      const quantityToAdd = Math.max(1, requestedQuantity)
      const cartItem = state.items.find(
        (item) => item.product._id === product._id
      )

      if (cartItem) {
        cartItem.quantity = Math.min(
          cartItem.quantity + quantityToAdd,
          product.productLeftCount
        )
      } else if (product.productLeftCount > 0) {
        state.items.push({
          product,
          quantity: Math.min(quantityToAdd, product.productLeftCount),
        })
      }
    },

    increaseQuantity: (state, action: PayloadAction<string>) => {
      const cartItem = state.items.find(
        (item) => item.product._id === action.payload
      )

      if (cartItem && cartItem.quantity < cartItem.product.productLeftCount) {
        cartItem.quantity += 1
      }
    },

    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const cartItem = state.items.find(
        (item) => item.product._id === action.payload
      )

      if (cartItem && cartItem.quantity > 1) {
        cartItem.quantity -= 1
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.product._id !== action.payload
      )
    },

    clearCart: (state) => {
      state.items = []
    },
  },
})

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions

export default cartSlice.reducer
