import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Member } from '../../types/member'

interface AuthState {
  member: Member | null
}

const initialState: AuthState = {
  member: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setMember: (state, action: PayloadAction<Member>) => {
      state.member = action.payload
    },
    clearMember: (state) => {
      state.member = null
    },
  },
})

export const { setMember, clearMember } = authSlice.actions

export default authSlice.reducer
