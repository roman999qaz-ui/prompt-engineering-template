import { Calendar, Check, Code2, Gamepad2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Game, LibraryEntry } from "@/types";

interface GameHeroBannerProps {
  game: Game;
  inLibrary: boolean;
  entry?: LibraryEntry;
  isAuthenticated: boolean;
  isMutating: boolean;
  onLoginClick: () => void;
  onAddToLibrary: (gameId: string) => void;
}

export function GameHeroBanner({
  game,
  inLibrary,
  entry,
  isAuthenticated,
  isMutating,
  onLoginClick,
  onAddToLibrary,
}: GameHeroBannerProps) {
  return (
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
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80";
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
              <Badge
                key={g}
                variant="secondary"
                className="px-3 py-1 font-semibold rounded-lg text-xs"
              >
                {g}
              </Badge>
            ))}
            {inLibrary && entry && (
              <Badge variant={entry.status} className="px-3 py-1 font-semibold shadow-xs text-xs">
                <Check className="mr-1.5 h-3.5 w-3.5" />
                {entry.status.replace(/_/g, " ")}
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
                onClick={onLoginClick}
              >
                Log In to Add to Library
              </Button>
            ) : !inLibrary ? (
              <Button
                className="h-11 px-7 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md cursor-pointer transition-all hover:scale-[1.02]"
                onClick={() => onAddToLibrary(game.id)}
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
  );
}
