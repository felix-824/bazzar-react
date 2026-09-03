import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import cartReducer, { type CartState } from '../features/cart/cartSlice'
import productReducer from '../features/products/productSlice'

const CART_STORAGE_KEY = 'bazzar_cart'

function isCartState(value: unknown): value is CartState {
  if (typeof value !== 'object' || value === null || !('items' in value)) {
    return false
  }

  const cart = value as { items?: unknown }

  return Array.isArray(cart.items)
}

function loadCartState(): CartState | undefined {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)

    if (!savedCart) {
      return undefined
    }

    const parsedCart = JSON.parse(savedCart)

    return isCartState(parsedCart) ? parsedCart : undefined
  } catch {
    return undefined
  }
}

function saveCartState(cart: CartState) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  } catch {
    // Ignore storage failures so cart actions keep working.
  }
}

const persistedCart = loadCartState()

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
  },
  ...(persistedCart ? { preloadedState: { cart: persistedCart } } : {}),
})

store.subscribe(() => {
  saveCartState(store.getState().cart)
})

export type RootState = ReturnType<typeof store.getState>
