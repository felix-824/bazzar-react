import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '../../types/product'

//Product state ichida products degan array bo‘ladi
//  va uning ichida faqat Productlar bo‘ladi.
interface ProductState {
  products: Product[]
}

const initialState: ProductState = {
  products: [],
}

const productSlice = createSlice({
  name: 'products',

  initialState,

  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload
    },
  },
})

export const { setProducts } = productSlice.actions

export default productSlice.reducer

