import { useDispatch } from 'react-redux'
import {
  CheckCircle2,
  Clock,
  Gamepad2,
  Library,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useLibrary } from '@/hooks/useLibrary'
import { setCurrentView } from '@/store/slices/appSlice'
import type { AppDispatch } from '@/store/store'

export function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()
  const { stats, isLoading } = useLibrary()

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-8 sm:px-8 max-w-4xl space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border bg-card p-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-2xl border border-primary/20">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight">
              {user.username}
            </h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(setCurrentView('library'))}
          >
            <Library className="mr-2 h-4 w-4" />
            Go to My Library
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <Gamepad2 className="h-5 w-5 text-primary" />
          Gaming Statistics
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 rounded-xl bg-muted/40 animate-pulse border"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Games */}
            <div className="rounded-xl border bg-card p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Total Games
                </span>
                <Library className="h-4 w-4 text-primary" />
              </div>
              <div className="text-3xl font-extrabold">
                {stats?.total_games ?? 0}
              </div>
              <p className="text-[11px] text-muted-foreground">In collection</p>
            </div>

            {/* Want to Play */}
            <div className="rounded-xl border bg-card p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Want to Play
                </span>
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-3xl font-extrabold text-amber-500">
                {stats?.want_to_play_count ?? 0}
              </div>
              <p className="text-[11px] text-muted-foreground">In backlog</p>
            </div>

            {/* Currently Playing */}
            <div className="rounded-xl border bg-card p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Playing
                </span>
                <Gamepad2 className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-3xl font-extrabold text-blue-500">
                {stats?.playing_count ?? 0}
              </div>
              <p className="text-[11px] text-muted-foreground">Active sessions</p>
            </div>

            {/* Completed */}
            <div className="rounded-xl border bg-card p-5 space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Completed
                </span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-extrabold text-emerald-500">
                {stats?.completed_count ?? 0}
              </div>
              <p className="text-[11px] text-muted-foreground">Finished games</p>
            </div>
          </div>
        )}

        {/* Rating Overview Card */}
        <div className="rounded-2xl border bg-gradient-to-r from-card to-muted/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-lg flex items-center justify-center sm:justify-start gap-2">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              Average Personal Rating
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Calculated across all rated games in your personal library.
            </p>
          </div>

          <div className="flex items-baseline gap-1 bg-card border rounded-xl px-6 py-3 shadow-xs">
            <span className="text-4xl font-black text-amber-500">
              {stats?.average_rating !== null && stats?.average_rating !== undefined
                ? stats.average_rating.toFixed(1)
                : '—'}
            </span>
            <span className="text-sm text-muted-foreground font-semibold">/ 10</span>
          </div>
        </div>
      </div>
    </div>
  )
}
