import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/types'

const TOKEN_KEY = 'gamelibrary_token'

interface AuthState {
  token: string | null
  user: User | null
  isAuthModalOpen: boolean
  authModalMode: 'login' | 'register'
}

const initialState: AuthState = {
  token: localStorage.getItem(TOKEN_KEY),
  user: null,
  isAuthModalOpen: false,
  authModalMode: 'login',
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) {
      state.user = action.payload.user
      state.token = action.payload.token
      localStorage.setItem(TOKEN_KEY, action.payload.token)
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload
    },
    logout(state) {
      state.user = null
      state.token = null
      localStorage.removeItem(TOKEN_KEY)
    },
    openAuthModal(
      state,
      action: PayloadAction<'login' | 'register' | undefined>
    ) {
      state.isAuthModalOpen = true
      state.authModalMode = action.payload ?? 'login'
    },
    setAuthModalMode(state, action: PayloadAction<'login' | 'register'>) {
      state.authModalMode = action.payload
    },
    closeAuthModal(state) {
      state.isAuthModalOpen = false
    },
  },
})

export const {
  setCredentials,
  setUser,
  logout,
  openAuthModal,
  setAuthModalMode,
  closeAuthModal,
} = authSlice.actions

export default authSlice.reducer
