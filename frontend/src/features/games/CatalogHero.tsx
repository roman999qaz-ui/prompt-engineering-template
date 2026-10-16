import { Flame, Gamepad2, Layers } from "lucide-react";

interface CatalogHeroProps {
  gamesCount: number;
  isLoading: boolean;
  isError: boolean;
}

export function CatalogHero({ gamesCount, isLoading, isError }: CatalogHeroProps) {
  return (
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
          Discover, Track & Build Your Ultimate{" "}
          <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Gaming Library
          </span>
        </h1>

        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Browse through thousands of iconic Steam and PC masterpieces. Track what you play, rate
          finished campaigns, and manage your backlog in one clean place.
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
          {!isLoading && !isError && gamesCount > 0 && (
            <span className="rounded-lg bg-primary/15 text-primary font-bold px-2.5 py-1 border border-primary/20">
              {gamesCount.toLocaleString()} games available
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
