import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Check, Flame, Gamepad2, Layers, Plus, Search, Sparkles, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCatalogFilters } from '@/hooks/useCatalogFilters'
import { useLibrary } from '@/hooks/useLibrary'
import { useGetGamesQuery } from '@/store/api/gamesApi'
import { openGameDetails, openStatusDialog } from '@/store/slices/appSlice'
import type { AppDispatch } from '@/store/store'
import type { Game } from '@/types'

const PAGE_SIZE = 24

export function CatalogPage() {
  const dispatch = useDispatch<AppDispatch>()
  const {
    search,
    setSearch,
    genre,
    setGenre,
    platform,
    setPlatform,
    clearFilters,
    hasActiveFilters,
    queryParams,
    genres,
    platforms,
  } = useCatalogFilters()

  const { data: games = [], isLoading, isError } = useGetGamesQuery(queryParams)
  const { isInLibrary, getEntryForGame, addToLibrary } = useLibrary()

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [prevFilterKey, setPrevFilterKey] = useState('')

  const currentFilterKey = `${search}_${genre}_${platform}`
  if (prevFilterKey !== currentFilterKey) {
    setPrevFilterKey(currentFilterKey)
    setVisibleCount(PAGE_SIZE)
  }

  const handleCardClick = (gameId: string) => {
    dispatch(openGameDetails(gameId))
  }

  const handleLibraryAction = (e: React.MouseEvent, game: Game) => {
    e.stopPropagation()
    const entry = getEntryForGame(game.id)
    if (entry) {
      dispatch(openStatusDialog(entry))
    } else {
      addToLibrary(game.id)
    }
  }

  const displayedGames = games.slice(0, visibleCount)

  return (
    <div className="container mx-auto px-4 py-8 sm:px-8 space-y-8">
      {/* Modern Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-primary/10 via-card to-background p-6 sm:p-10 shadow-xs">
        {/* Ambient background blur */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Flame className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span>Over 2,200+ Authentic Titles</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl text-foreground">
            Discover, Track & Build Your Ultimate{' '}
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Gaming Library
            </span>
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Browse through thousands of iconic Steam and PC masterpieces. Track what you play,
            rate finished campaigns, and manage your backlog in one clean place.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5 rounded-lg bg-background/80 px-2.5 py-1 border border-border/60">
              <Gamepad2 className="h-3.5 w-3.5 text-primary" />
              Direct Steam & F2P Data
            </span>
            <span className="flex items-center gap-1.5 rounded-lg bg-background/80 px-2.5 py-1 border border-border/60">
              <Layers className="h-3.5 w-3.5 text-primary" />
              Live Filtering & Statuses
            </span>
            {!isLoading && !isError && games.length > 0 && (
              <span className="rounded-lg bg-primary/15 text-primary font-bold px-2.5 py-1 border border-primary/20">
                {games.length.toLocaleString()} games available
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-xs">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search thousands of games by title (e.g. Witcher, Cyberpunk, Elden Ring)..."
            className="pl-10 pr-10 h-11 text-sm bg-background border-border/80 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="space-y-3 pt-1">
          {/* Genre Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground mr-1">
              Genre:
            </span>
            {genres.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGenre(g)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                  genre === g
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs ring-2 ring-primary/20 scale-[1.02]'
                    : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Platform Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground mr-1">
              Platform:
            </span>
            {platforms.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                  platform === p
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs ring-2 ring-primary/20 scale-[1.02]'
                    : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {p}
              </button>
            ))}

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-7 text-xs text-muted-foreground hover:text-foreground ml-auto cursor-pointer"
              >
                Clear all filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-84 rounded-2xl bg-muted/40 animate-pulse border border-border/50"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center text-destructive space-y-2">
          <p className="font-bold text-base">Failed to load games catalog.</p>
          <p className="text-xs text-muted-foreground">
            Please verify the backend server is running on port 8001.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && games.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border/80 p-12 text-center space-y-4 max-w-md mx-auto my-8">
          <Sparkles className="mx-auto h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-bold">No matching games found</h3>
          <p className="text-sm text-muted-foreground">
            No titles match your current search and filter combination.
          </p>
          <Button variant="outline" size="sm" onClick={clearFilters} className="cursor-pointer">
            Reset Filters
          </Button>
        </div>
      )}

      {/* Game Cards Grid */}
      {!isLoading && !isError && displayedGames.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedGames.map((game) => {
              const inLibrary = isInLibrary(game.id)
              const entry = getEntryForGame(game.id)

              return (
                <div
                  key={game.id}
                  onClick={() => handleCardClick(game.id)}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/40 dark:hover:shadow-primary/5 cursor-pointer"
                >
                  {/* Cover Image Container */}
                  <div className="aspect-[16/10] w-full overflow-hidden bg-muted relative">
                    <img
                      src={game.cover_image}
                      alt={game.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Release Year Pill */}
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white border border-white/10">
                        {game.release_year}
                      </span>
                    </div>

                    {/* Status Indicator if in library */}
                    {inLibrary && entry && (
                      <div className="absolute top-2.5 right-2.5">
                        <Badge variant={entry.status} className="shadow-md backdrop-blur-md font-semibold">
                          <Check className="mr-1 h-3 w-3" />
                          {entry.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-between p-4.5 space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="truncate max-w-[150px] font-medium">{game.developer}</span>
                        <div className="flex gap-1">
                          {game.platforms.slice(0, 2).map((plat) => (
                            <span
                              key={plat}
                              className="rounded border border-border/60 bg-muted/40 px-1 py-0.2 text-[9px] font-medium text-muted-foreground"
                            >
                              {plat === 'PlayStation' ? 'PS' : plat === 'Nintendo Switch' ? 'Switch' : plat}
                            </span>
                          ))}
                        </div>
                      </div>

                      <h3 className="font-extrabold text-base line-clamp-1 group-hover:text-primary transition-colors">
                        {game.title}
                      </h3>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {game.description}
                      </p>
                    </div>

                    {/* Genres & Action button */}
                    <div className="space-y-3 pt-1">
                      <div className="flex flex-wrap gap-1">
                        {game.genres.slice(0, 2).map((gen) => (
                          <span
                            key={gen}
                            className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                          >
                            {gen}
                          </span>
                        ))}
                      </div>

                      {/* Action button */}
                      <Button
                        size="sm"
                        variant={inLibrary ? 'secondary' : 'default'}
                        className={`w-full text-xs h-8 cursor-pointer rounded-lg transition-all ${
                          inLibrary
                            ? 'bg-secondary hover:bg-secondary/80 font-medium'
                            : 'bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs'
                        }`}
                        onClick={(e) => handleLibraryAction(e, game)}
                      >
                        {inLibrary ? (
                          <>
                            <Check className="h-3.5 w-3.5 mr-1" />
                            In Library
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            Add to Library
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Load More Button */}
          {visibleCount < games.length && (
            <div className="flex flex-col items-center justify-center pt-8 pb-4 gap-3">
              <p className="text-xs text-muted-foreground font-medium">
                Showing {displayedGames.length.toLocaleString()} of {games.length.toLocaleString()} games
              </p>
              <Button
                variant="outline"
                size="lg"
                className="px-8 h-11 shadow-xs cursor-pointer font-bold rounded-xl border-border hover:border-primary/50 transition-all hover:scale-[1.02]"
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              >
                Load More Games (+{PAGE_SIZE})
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
