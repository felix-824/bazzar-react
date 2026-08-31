import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../features/cart/cartSlice'
import productReducer from '../features/products/productSlice'

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
