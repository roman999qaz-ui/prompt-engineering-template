import { useDispatch, useSelector } from 'react-redux'
import {
  ArrowLeft,
  Calendar,
  Check,
  Code2,
  Gamepad2,
  Info,
  Layers,
  Plus,
  Star,
  Trash2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useLibrary } from '@/hooks/useLibrary'
import { useGetGameQuery } from '@/store/api/gamesApi'
import { setCurrentView } from '@/store/slices/appSlice'
import type { AppDispatch, RootState } from '@/store/store'
import type { PlayStatus } from '@/types'

export function GameDetailsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const selectedGameId = useSelector(
    (state: RootState) => state.app.selectedGameId
  )
  const { isAuthenticated, openLoginModal } = useAuth()
  const {
    isInLibrary,
    getEntryForGame,
    addToLibrary,
    updateEntry,
    removeEntry,
    isMutating,
  } = useLibrary()

  const {
    data: game,
    isLoading,
    isError,
  } = useGetGameQuery(selectedGameId || '', {
    skip: !selectedGameId,
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-8 max-w-6xl animate-pulse space-y-6">
        <div className="h-9 w-32 bg-muted rounded-xl" />
        <div className="h-96 bg-muted rounded-3xl" />
      </div>
    )
  }

  if (isError || !game) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md space-y-4">
        <h2 className="text-2xl font-black">Game Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The requested game could not be retrieved from the catalog.
        </p>
        <Button onClick={() => dispatch(setCurrentView('catalog'))} className="rounded-xl">
          Back to Catalog
        </Button>
      </div>
    )
  }

  const inLibrary = isInLibrary(game.id)
  const entry = getEntryForGame(game.id)

  const handleStatusChange = async (newStatus: PlayStatus) => {
    if (entry) {
      await updateEntry(entry.id, { status: newStatus })
    }
  }

  const handleRatingChange = async (newRating: number) => {
    if (entry) {
      const finalRating = entry.rating === newRating ? null : newRating
      await updateEntry(entry.id, { rating: finalRating })
    }
  }

  const handleRemove = async () => {
    if (entry && window.confirm('Remove this game from your personal library?')) {
      await removeEntry(entry.id)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-8 max-w-6xl space-y-8">
      {/* Back button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch(setCurrentView('catalog'))}
          className="text-muted-foreground hover:text-foreground cursor-pointer -ml-2 rounded-xl"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Catalog
        </Button>
      </div>

      {/* Cinematic Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card shadow-xl transition-all">
        {/* Atmospheric Colored Glow derived from the game cover */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 dark:opacity-40 blur-3xl scale-125 pointer-events-none -z-0"
          style={{ backgroundImage: `url(${game.cover_image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/85 to-card/40 z-0" />

        {/* Content Container */}
        <div className="relative z-10 p-6 sm:p-10 flex flex-col lg:flex-row items-center lg:items-start gap-8">
          {/* Uncropped Widescreen Cover Image */}
          <div className="w-full lg:w-[480px] shrink-0">
            <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border/80 bg-muted/60 shadow-2xl relative group">
              <img
                src={game.cover_image}
                alt={game.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Release Year badge on image */}
              <div className="absolute bottom-3 left-3">
                <span className="rounded-lg bg-black/70 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-white border border-white/10 shadow-sm">
                  {game.release_year}
                </span>
              </div>
            </div>
          </div>

          {/* Title, Metadata & Hero CTA */}
          <div className="flex-1 space-y-4 text-center lg:text-left w-full">
            {/* Genre & Status Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              {game.genres.map((g) => (
                <Badge key={g} variant="secondary" className="px-3 py-1 font-semibold rounded-lg text-xs">
                  {g}
                </Badge>
              ))}
              {inLibrary && entry && (
                <Badge variant={entry.status} className="px-3 py-1 font-semibold shadow-xs text-xs">
                  <Check className="mr-1.5 h-3.5 w-3.5" />
                  {entry.status.replace(/_/g, ' ')}
                </Badge>
              )}
            </div>

            {/* Game Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-foreground">
              {game.title}
            </h1>

            {/* Developer and Release Year */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium">
                <Code2 className="h-4 w-4 text-primary" />
                <span>{game.developer}</span>
              </span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{game.release_year}</span>
              </span>
            </div>

            {/* Platforms */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              {game.platforms.map((plat) => (
                <span
                  key={plat}
                  className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/80 backdrop-blur px-3 py-1.5 text-xs font-semibold text-foreground/90 shadow-2xs"
                >
                  <Gamepad2 className="h-3.5 w-3.5 text-primary" />
                  {plat}
                </span>
              ))}
            </div>

            {/* Primary Action Button */}
            <div className="pt-3 flex justify-center lg:justify-start">
              {!isAuthenticated ? (
                <Button
                  className="h-11 px-6 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md cursor-pointer"
                  onClick={openLoginModal}
                >
                  Log In to Add to Library
                </Button>
              ) : !inLibrary ? (
                <Button
                  className="h-11 px-7 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md cursor-pointer transition-all hover:scale-[1.02]"
                  onClick={() => addToLibrary(game.id)}
                  disabled={isMutating}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add to My Library
                </Button>
              ) : (
                <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-xl">
                  <Check className="h-4 w-4" />
                  In Your Personal Library
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Details & Library Control Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description & Metadata */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-4 shadow-xs">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2.5 text-foreground">
              <Info className="h-5 w-5 text-primary" />
              About the Game
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground whitespace-pre-line">
              {game.description}
            </p>
          </div>

          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-4 shadow-xs">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2.5 text-foreground">
              <Layers className="h-5 w-5 text-primary" />
              Game Overview
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 space-y-1">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  Developer / Publisher
                </span>
                <p className="font-bold text-sm text-foreground">{game.developer}</p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 space-y-1">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  Release Year
                </span>
                <p className="font-bold text-sm text-foreground">{game.release_year}</p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 space-y-1">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  Primary Genres
                </span>
                <p className="font-bold text-sm text-foreground">{game.genres.join(', ')}</p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 space-y-1">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  Supported Platforms
                </span>
                <p className="font-bold text-sm text-foreground">{game.platforms.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Library Management or Callout */}
        <div className="lg:col-span-1 space-y-6">
          {isAuthenticated && inLibrary && entry ? (
            <div className="rounded-3xl border border-primary/30 bg-card p-6 sm:p-7 space-y-6 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base flex items-center gap-2 text-foreground">
                  <Gamepad2 className="h-5 w-5 text-primary" />
                  Your Tracking Status
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="text-xs text-destructive hover:bg-destructive/10 cursor-pointer h-8 px-2 rounded-lg"
                  disabled={isMutating}
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" />
                  Remove
                </Button>
              </div>

              {/* Status Switcher */}
              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Play Status
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {(
                    [
                      { id: 'want_to_play', label: 'Want to Play' },
                      { id: 'playing', label: 'Currently Playing' },
                      { id: 'completed', label: 'Completed' },
                    ] as const
                  ).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      disabled={isMutating}
                      onClick={() => handleStatusChange(s.id)}
                      className={`rounded-xl border p-3 text-left text-xs font-semibold transition-all cursor-pointer ${
                        entry.status === s.id
                          ? 'border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/40'
                          : 'border-border/80 bg-background/60 text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Control (1-10) */}
              <div className="space-y-3 border-t border-border/80 pt-5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Personal Rating (1-10)
                  </label>
                  {entry.rating !== null && (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {entry.rating} / 10
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                    <button
                      key={score}
                      type="button"
                      disabled={isMutating}
                      onClick={() => handleRatingChange(score)}
                      className={`flex h-9 items-center justify-center rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        entry.rating === score
                          ? 'border-amber-500 bg-amber-500 text-white shadow-xs scale-105'
                          : 'border-border/80 bg-background/60 text-foreground hover:bg-muted'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 space-y-4 shadow-xs">
              <h3 className="font-bold text-base text-foreground">Why track this game?</h3>
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Organize your gaming backlog and queue next playthroughs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Leave personal scores from 1 to 10 for your profile history.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Track how many hours and completed campaigns you conquer.</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
