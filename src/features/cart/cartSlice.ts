import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '../../types/product'

interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload
      const cartItem = state.items.find(
        (item) => item.product._id === product._id
      )

      if (cartItem) {
        if (cartItem.quantity < product.productLeftCount) {
          cartItem.quantity += 1
        }
      } else if (product.productLeftCount > 0) {
        state.items.push({
          product,
          quantity: 1,
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
