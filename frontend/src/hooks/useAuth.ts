import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  authApi,
  useGetMeQuery,
  useLoginMutation,
  useRegisterMutation,
} from '@/store/api/authApi'
import { libraryApi } from '@/store/api/libraryApi'
import {
  closeAuthModal,
  logout as logoutAction,
  openAuthModal,
  setAuthModalMode,
  setCredentials,
  setUser,
} from '@/store/slices/authSlice'
import type { AppDispatch, RootState } from '@/store/store'
import type { UserLoginRequest, UserRegisterRequest } from '@/types'

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>()
  const { user, token, isAuthModalOpen, authModalMode } = useSelector(
    (state: RootState) => state.auth
  )

  const [loginMutation, { isLoading: isLoginLoading, error: loginError }] =
    useLoginMutation()
  const [registerMutation, { isLoading: isRegisterLoading, error: registerError }] =
    useRegisterMutation()

  // Fetch current user if token exists but user is not loaded
  const { data: meData, isError: isMeError } = useGetMeQuery(undefined, {
    skip: !token || !!user,
  })

  useEffect(() => {
    if (meData) {
      dispatch(setUser(meData))
    } else if (isMeError) {
      dispatch(logoutAction())
    }
  }, [meData, isMeError, dispatch])

  const login = async (credentials: UserLoginRequest) => {
    const res = await loginMutation(credentials).unwrap()
    dispatch(setCredentials(res))
    dispatch(libraryApi.util.resetApiState())
    dispatch(closeAuthModal())
    return res
  }

  const register = async (credentials: UserRegisterRequest) => {
    const res = await registerMutation(credentials).unwrap()
    dispatch(setCredentials(res))
    dispatch(libraryApi.util.resetApiState())
    dispatch(closeAuthModal())
    return res
  }

  const logout = () => {
    dispatch(logoutAction())
    dispatch(libraryApi.util.resetApiState())
    dispatch(authApi.util.resetApiState())
  }

  return {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isAuthModalOpen,
    authModalMode,
    isLoginLoading,
    isRegisterLoading,
    loginError,
    registerError,
    login,
    register,
    logout,
    openLoginModal: () => dispatch(openAuthModal('login')),
    openRegisterModal: () => dispatch(openAuthModal('register')),
    setAuthModalMode: (mode: 'login' | 'register') =>
      dispatch(setAuthModalMode(mode)),
    closeAuthModal: () => dispatch(closeAuthModal()),
  }
}
