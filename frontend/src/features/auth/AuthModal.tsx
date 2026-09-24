import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'

export function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    closeAuthModal,
    login,
    register,
    isLoginLoading,
    isRegisterLoading,
  } = useAuth()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    try {
      if (authModalMode === 'login') {
        await login({ email, password })
      } else {
        await register({ username, email, password })
      }
      // Reset form
      setUsername('')
      setEmail('')
      setPassword('')
    } catch (err: unknown) {
      const errorObj = err as { data?: { detail?: string } }
      setErrorMessage(
        errorObj.data?.detail || 'An unexpected authentication error occurred.'
      )
    }
  }

  const handleTabSwitch = (newMode: 'login' | 'register') => {
    setAuthModalMode(newMode)
    setErrorMessage(null)
  }

  const handleClose = () => {
    closeAuthModal()
    setErrorMessage(null)
  }

  const isLoading = isLoginLoading || isRegisterLoading

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {authModalMode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </DialogTitle>
          <DialogDescription>
            {authModalMode === 'login'
              ? 'Sign in to access your personal game library and ratings.'
              : 'Join GameLibrary to start tracking your video game collection.'}
          </DialogDescription>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="flex rounded-lg bg-muted p-1 text-sm font-medium">
          <button
            type="button"
            className={`flex-1 rounded-md py-1.5 transition-colors cursor-pointer ${
              authModalMode === 'login'
                ? 'bg-background shadow-xs font-semibold text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => handleTabSwitch('login')}
          >
            Log In
          </button>
          <button
            type="button"
            className={`flex-1 rounded-md py-1.5 transition-colors cursor-pointer ${
              authModalMode === 'register'
                ? 'bg-background shadow-xs font-semibold text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => handleTabSwitch('register')}
          >
            Sign Up
          </button>
        </div>

        {errorMessage && (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {authModalMode === 'register' && (
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="e.g. PixelKnight"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                disabled={isLoading}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? 'Processing...'
                : authModalMode === 'login'
                ? 'Log In'
                : 'Create Account'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
