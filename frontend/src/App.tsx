import { useDispatch, useSelector } from 'react-redux'
import { Gamepad2, Heart } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { AuthModal } from '@/features/auth/AuthModal'
import { CatalogPage } from '@/features/games/CatalogPage'
import { GameDetailsPage } from '@/features/games/GameDetailsPage'
import { MyLibraryPage } from '@/features/games/MyLibraryPage'
import { ProfilePage } from '@/features/games/ProfilePage'
import { StatusRatingDialog } from '@/features/games/StatusRatingDialog'
import { setCurrentView } from '@/store/slices/appSlice'
import type { AppDispatch, RootState } from '@/store/store'

function App() {
  const dispatch = useDispatch<AppDispatch>()
  const currentView = useSelector((state: RootState) => state.app.currentView)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-200">
      <Navbar />

      <main className="flex-1">
        {currentView === 'catalog' && <CatalogPage />}
        {currentView === 'details' && <GameDetailsPage />}
        {currentView === 'library' && <MyLibraryPage />}
        {currentView === 'profile' && <ProfilePage />}
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-border/70 bg-card/40 py-8 text-xs text-muted-foreground transition-colors">
        <div className="container mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Gamepad2 className="h-4 w-4" />
            </div>
            <span className="font-bold text-foreground">
              Game<span className="text-primary font-black">Vault</span>
            </span>
            <span className="text-muted-foreground/60">— 2,200+ Video Game Library</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => dispatch(setCurrentView('catalog'))}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Catalog
            </button>
            <button
              type="button"
              onClick={() => dispatch(setCurrentView('library'))}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              My Library
            </button>
            <button
              type="button"
              onClick={() => dispatch(setCurrentView('profile'))}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Stats
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-muted-foreground/80">
            <span>Crafted with</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500 inline" />
            <span>using FastAPI & React</span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <AuthModal />
      <StatusRatingDialog />
    </div>
  )
}

export default App
