import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Star, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useLibrary } from '@/hooks/useLibrary'
import { closeStatusDialog } from '@/store/slices/appSlice'
import type { AppDispatch, RootState } from '@/store/store'
import type { LibraryEntry, PlayStatus } from '@/types'

interface DialogFormProps {
  entry: LibraryEntry
  onClose: () => void
}

function StatusRatingDialogForm({ entry, onClose }: DialogFormProps) {
  const { updateEntry, removeEntry, isMutating } = useLibrary()
  const [status, setStatus] = useState<PlayStatus>(entry.status)
  const [rating, setRating] = useState<number | null>(entry.rating)

  const handleSave = async () => {
    await updateEntry(entry.id, {
      status,
      rating,
    })
    onClose()
  }

  const handleRemove = async () => {
    if (window.confirm('Remove this game from your personal library?')) {
      await removeEntry(entry.id)
      onClose()
    }
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-xl">
          Update {entry.game?.title ?? 'Game'}
        </DialogTitle>
        <DialogDescription>
          Modify your play status and personal rating for this game.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-5 pt-2">
        {/* Status Selection */}
        <div className="space-y-2">
          <Label>Play Status</Label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'want_to_play', label: 'Want to Play' },
                { id: 'playing', label: 'Playing' },
                { id: 'completed', label: 'Completed' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStatus(item.id)}
                className={`rounded-lg border p-2.5 text-center text-xs font-medium transition-all ${
                  status === item.id
                    ? 'border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rating Selection (1-10) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Personal Rating (1–10)</Label>
            {rating !== null && (
              <button
                type="button"
                onClick={() => setRating(null)}
                className="text-xs text-muted-foreground hover:text-destructive underline"
              >
                Clear Rating
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 justify-between">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
              <button
                key={score}
                type="button"
                onClick={() => setRating(rating === score ? null : score)}
                className={`flex h-8 w-8 items-center justify-center rounded-md border text-xs font-semibold transition-colors ${
                  rating === score
                    ? 'border-amber-500 bg-amber-500 text-white shadow-xs'
                    : 'border-border bg-card text-foreground hover:bg-muted'
                }`}
              >
                {score}
              </button>
            ))}
          </div>
          {rating !== null && (
            <p className="flex items-center gap-1 text-xs text-amber-500 font-medium pt-1">
              <Star className="h-3.5 w-3.5 fill-current" />
              Rated {rating} / 10
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t pt-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10"
            onClick={handleRemove}
            disabled={isMutating}
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Remove
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isMutating}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isMutating}>
              {isMutating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

export function StatusRatingDialog() {
  const dispatch = useDispatch<AppDispatch>()
  const { isStatusDialogOpen, statusDialogEntry } = useSelector(
    (state: RootState) => state.app
  )

  const handleClose = () => {
    dispatch(closeStatusDialog())
  }

  if (!statusDialogEntry) return null

  return (
    <Dialog
      open={isStatusDialogOpen}
      onOpenChange={(open) => !open && handleClose()}
    >
      <StatusRatingDialogForm
        key={statusDialogEntry.id}
        entry={statusDialogEntry}
        onClose={handleClose}
      />
    </Dialog>
  )
}
