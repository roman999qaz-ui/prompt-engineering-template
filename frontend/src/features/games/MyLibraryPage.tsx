import { useDispatch, useSelector } from 'react-redux'
import { Edit3, Library, Sparkles, Star, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useLibrary } from '@/hooks/useLibrary'
import {
  openGameDetails,
  openStatusDialog,
  setCurrentView,
  setLibraryFilter,
} from '@/store/slices/appSlice'
import type { AppDispatch, RootState } from '@/store/store'
import type { LibraryEntry, PlayStatus } from '@/types'

export function MyLibraryPage() {
  const dispatch = useDispatch<AppDispatch>()
  const libraryFilter = useSelector(
    (state: RootState) => state.app.libraryFilter
  )

  const activeStatus = libraryFilter === 'all' ? undefined : (libraryFilter as PlayStatus)
  const { entries, stats, isLoading, removeEntry, isMutating } = useLibrary(activeStatus)

  const handleCardClick = (gameId: string) => {
    dispatch(openGameDetails(gameId))
  }

  const handleEdit = (e: React.MouseEvent, entry: LibraryEntry) => {
    e.stopPropagation()
    dispatch(openStatusDialog(entry))
  }

  const handleRemove = async (e: React.MouseEvent, entryId: string) => {
    e.stopPropagation()
    if (window.confirm('Remove this game from your personal library?')) {
      await removeEntry(entryId)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl flex items-center gap-3">
          <Library className="h-8 w-8 text-primary" />
          My Game Library
        </h1>
        <p className="text-muted-foreground text-base max-w-2xl">
          Track your gaming backlog, currently active playthroughs, and personal
          ratings for completed titles.
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b pb-4">
        {(
          [
            { id: 'all', label: 'All Games', count: stats?.total_games ?? 0 },
            {
              id: 'want_to_play',
              label: 'Want to Play',
              count: stats?.want_to_play_count ?? 0,
            },
            {
              id: 'playing',
              label: 'Playing',
              count: stats?.playing_count ?? 0,
            },
            {
              id: 'completed',
              label: 'Completed',
              count: stats?.completed_count ?? 0,
            },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => dispatch(setLibraryFilter(tab.id))}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              libraryFilter === tab.id
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-xs font-semibold ${
                libraryFilter === tab.id
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-background text-foreground'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-72 rounded-xl bg-muted/40 animate-pulse border border-border/50"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && entries.length === 0 && (
        <div className="rounded-2xl border border-dashed p-12 text-center space-y-4 max-w-md mx-auto my-8">
          <Sparkles className="mx-auto h-10 w-10 text-muted-foreground" />
          <h3 className="text-xl font-bold">No games in this section</h3>
          <p className="text-sm text-muted-foreground">
            {libraryFilter === 'all'
              ? "Your library is empty. Browse the catalog and add games you'd like to play."
              : `You don't have any games marked as "${libraryFilter.replace(/_/g, ' ')}".`}
          </p>
          <Button onClick={() => dispatch(setCurrentView('catalog'))}>
            Browse Catalog
          </Button>
        </div>
      )}

      {/* Library Grid */}
      {!isLoading && entries.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {entries.map((entry) => {
            const game = entry.game
            if (!game) return null

            return (
              <div
                key={entry.id}
                onClick={() => handleCardClick(game.id)}
                className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
              >
                {/* Cover Image */}
                <div className="aspect-16/10 w-full overflow-hidden bg-muted relative">
                  <img
                    src={game.cover_image}
                    alt={game.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'
                    }}
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <Badge variant={entry.status} className="shadow-xs backdrop-blur">
                      {entry.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-4.5 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{game.developer}</span>
                      <span>{game.release_year}</span>
                    </div>
                    <h3 className="font-bold text-base line-clamp-1 group-hover:text-primary transition-colors">
                      {game.title}
                    </h3>
                  </div>

                  {/* Rating display */}
                  <div className="flex items-center justify-between pt-1 border-t text-xs">
                    {entry.rating !== null ? (
                      <span className="flex items-center gap-1 font-bold text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        {entry.rating} / 10
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">
                        Not rated yet
                      </span>
                    )}

                    {/* Quick Action Buttons */}
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title="Edit status or rating"
                        onClick={(e) => handleEdit(e, entry)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Remove from library"
                        disabled={isMutating}
                        onClick={(e) => handleRemove(e, entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
