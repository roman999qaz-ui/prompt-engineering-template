import { useState } from "react";
import { useDispatch } from "react-redux";
import { Search, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CatalogHero } from "@/features/games/CatalogHero";
import { GameCard } from "@/features/games/GameCard";
import { useCatalogFilters } from "@/hooks/useCatalogFilters";
import { useLibrary } from "@/hooks/useLibrary";
import { useGetGamesQuery } from "@/store/api/gamesApi";
import { openGameDetails, openStatusDialog } from "@/store/slices/appSlice";
import type { AppDispatch } from "@/store/store";
import type { Game } from "@/types";

const PAGE_SIZE = 24;

export function CatalogPage() {
  const dispatch = useDispatch<AppDispatch>();
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
  } = useCatalogFilters();

  const { data: games = [], isLoading, isError } = useGetGamesQuery(queryParams);
  const { isInLibrary, getEntryForGame, addToLibrary } = useLibrary();

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [prevFilterKey, setPrevFilterKey] = useState("");

  const currentFilterKey = `${search}_${genre}_${platform}`;
  if (prevFilterKey !== currentFilterKey) {
    setPrevFilterKey(currentFilterKey);
    setVisibleCount(PAGE_SIZE);
  }

  const handleCardClick = (gameId: string) => {
    dispatch(openGameDetails(gameId));
  };

  const handleLibraryAction = (e: React.MouseEvent, game: Game) => {
    e.stopPropagation();
    const entry = getEntryForGame(game.id);
    if (entry) {
      dispatch(openStatusDialog(entry));
    } else {
      addToLibrary(game.id);
    }
  };

  const displayedGames = games.slice(0, visibleCount);

  return (
    <div className="container mx-auto px-4 py-8 sm:px-8 space-y-8">
      {/* Modern Hero Section */}
      <CatalogHero gamesCount={games.length} isLoading={isLoading} isError={isError} />

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
              onClick={() => setSearch("")}
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
            <span className="text-xs font-semibold text-muted-foreground mr-1">Genre:</span>
            {genres.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGenre(g)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                  genre === g
                    ? "bg-primary text-primary-foreground font-bold shadow-xs ring-2 ring-primary/20 scale-[1.02]"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Platform Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground mr-1">Platform:</span>
            {platforms.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                  platform === p
                    ? "bg-primary text-primary-foreground font-bold shadow-xs ring-2 ring-primary/20 scale-[1.02]"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
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
            {displayedGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                inLibrary={isInLibrary(game.id)}
                entry={getEntryForGame(game.id)}
                onCardClick={handleCardClick}
                onLibraryAction={handleLibraryAction}
              />
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < games.length && (
            <div className="flex flex-col items-center justify-center pt-8 pb-4 gap-3">
              <p className="text-xs text-muted-foreground font-medium">
                Showing {displayedGames.length.toLocaleString()} of {games.length.toLocaleString()}{" "}
                games
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
  );
}
