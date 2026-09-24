import { useDispatch, useSelector } from 'react-redux'
import { Gamepad2, Library, LogIn, LogOut, User as UserIcon } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useLibrary } from '@/hooks/useLibrary'
import { setCurrentView, type AppView } from '@/store/slices/appSlice'
import type { AppDispatch, RootState } from '@/store/store'

export function Navbar() {
  const dispatch = useDispatch<AppDispatch>()
  const currentView = useSelector((state: RootState) => state.app.currentView)
  const { user, isAuthenticated, logout, openLoginModal, openRegisterModal } =
    useAuth()
  const { stats } = useLibrary()

  const handleNav = (view: AppView) => {
    dispatch(setCurrentView(view))
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Brand */}
        <div
          className="flex cursor-pointer items-center gap-3 font-bold text-xl tracking-tight transition-transform hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => handleNav('catalog')}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary via-indigo-600 to-purple-500 text-white shadow-md shadow-primary/20">
            <Gamepad2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg leading-tight tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
              Game<span className="text-primary font-black">Vault</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
              Library & Tracker
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 font-medium text-sm bg-muted/50 p-1 rounded-xl border border-border/50">
          <button
            type="button"
            onClick={() => handleNav('catalog')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'catalog'
                ? 'bg-background text-foreground shadow-xs border border-border/60'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }`}
          >
            Catalog
          </button>

          {isAuthenticated && (
            <>
              <button
                type="button"
                onClick={() => handleNav('library')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'library'
                    ? 'bg-background text-foreground shadow-xs border border-border/60'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
              >
                <Library className="h-3.5 w-3.5" />
                <span>My Library</span>
                {stats && stats.total_games > 0 && (
                  <span className="ml-1 rounded-full bg-primary/15 text-primary px-1.5 py-0.2 text-[10px] font-bold">
                    {stats.total_games}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleNav('profile')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'profile'
                    ? 'bg-background text-foreground shadow-xs border border-border/60'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
              >
                <UserIcon className="h-3.5 w-3.5" />
                <span>Stats & Profile</span>
              </button>
            </>
          )}
        </nav>

        {/* Right Section: Theme Toggle & Auth Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <div className="h-4 w-[1px] bg-border/60 hidden sm:block" />

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleNav('profile')}
                className="hidden sm:flex items-center gap-2 rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs font-semibold hover:border-primary/50 transition-all cursor-pointer shadow-2xs"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[11px] font-bold text-primary">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <span>{user?.username}</span>
              </button>

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                title="Log out"
                className="h-9 px-3 text-xs cursor-pointer border-border/80"
              >
                <LogOut className="h-3.5 w-3.5 sm:mr-1.5" />
                <span className="hidden sm:inline">Log Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={openLoginModal}
                className="h-9 text-xs cursor-pointer"
              >
                <LogIn className="h-3.5 w-3.5 mr-1.5" />
                Log In
              </Button>
              <Button
                size="sm"
                onClick={openRegisterModal}
                className="h-9 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="flex md:hidden items-center justify-around border-t border-border/70 bg-card/60 px-2 py-2 text-xs font-medium">
        <button
          type="button"
          onClick={() => handleNav('catalog')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
            currentView === 'catalog'
              ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Gamepad2 className="h-4 w-4" />
          <span>Catalog</span>
        </button>

        {isAuthenticated && (
          <>
            <button
              type="button"
              onClick={() => handleNav('library')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all relative ${
                currentView === 'library'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Library className="h-4 w-4" />
              <span>Library</span>
              {stats && stats.total_games > 0 && (
                <span className="ml-1 rounded-full bg-primary-foreground/20 px-1.5 py-0.2 text-[10px] font-bold">
                  {stats.total_games}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleNav('profile')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                currentView === 'profile'
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <UserIcon className="h-4 w-4" />
              <span>Profile</span>
            </button>
          </>
        )}
      </div>
    </header>
  )
}
