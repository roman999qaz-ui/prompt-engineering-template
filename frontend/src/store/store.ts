import { configureStore } from '@reduxjs/toolkit'
import { authApi } from '@/store/api/authApi'
import { gamesApi } from '@/store/api/gamesApi'
import { libraryApi } from '@/store/api/libraryApi'
import appReducer from '@/store/slices/appSlice'
import authReducer from '@/store/slices/authSlice'

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [gamesApi.reducerPath]: gamesApi.reducer,
    [libraryApi.reducerPath]: libraryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      gamesApi.middleware,
      libraryApi.middleware
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
