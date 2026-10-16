import { Gamepad2, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LibraryEntry, PlayStatus } from "@/types";

interface GameTrackingCardProps {
  isAuthenticated: boolean;
  inLibrary: boolean;
  entry?: LibraryEntry;
  isMutating: boolean;
  onStatusChange: (newStatus: PlayStatus) => Promise<void>;
  onRatingChange: (newRating: number) => Promise<void>;
  onRemove: () => Promise<void>;
}

export function GameTrackingCard({
  isAuthenticated,
  inLibrary,
  entry,
  isMutating,
  onStatusChange,
  onRatingChange,
  onRemove,
}: GameTrackingCardProps) {
  if (isAuthenticated && inLibrary && entry) {
    return (
      <div className="rounded-3xl border border-primary/30 bg-card p-6 sm:p-7 space-y-6 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base flex items-center gap-2 text-foreground">
            <Gamepad2 className="h-5 w-5 text-primary" />
            Your Tracking Status
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
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
                { id: "want_to_play", label: "Want to Play" },
                { id: "playing", label: "Currently Playing" },
                { id: "completed", label: "Completed" },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                type="button"
                disabled={isMutating}
                onClick={() => onStatusChange(s.id)}
                className={`rounded-xl border p-3 text-left text-xs font-semibold transition-all cursor-pointer ${
                  entry.status === s.id
                    ? "border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary/40"
                    : "border-border/80 bg-background/60 text-muted-foreground hover:bg-muted"
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
                onClick={() => onRatingChange(score)}
                className={`flex h-9 items-center justify-center rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  entry.rating === score
                    ? "border-amber-500 bg-amber-500 text-white shadow-xs scale-105"
                    : "border-border/80 bg-background/60 text-foreground hover:bg-muted"
                }`}
              >
                {score}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
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
  );
}
