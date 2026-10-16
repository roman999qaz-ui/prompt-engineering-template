import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Info, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameHeroBanner } from "@/features/games/GameHeroBanner";
import { GameTrackingCard } from "@/features/games/GameTrackingCard";
import { useAuth } from "@/hooks/useAuth";
import { useLibrary } from "@/hooks/useLibrary";
import { useGetGameQuery } from "@/store/api/gamesApi";
import { setCurrentView } from "@/store/slices/appSlice";
import type { AppDispatch, RootState } from "@/store/store";
import type { PlayStatus } from "@/types";

export function GameDetailsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const selectedGameId = useSelector((state: RootState) => state.app.selectedGameId);
  const { isAuthenticated, openLoginModal } = useAuth();
  const { isInLibrary, getEntryForGame, addToLibrary, updateEntry, removeEntry, isMutating } =
    useLibrary();

  const {
    data: game,
    isLoading,
    isError,
  } = useGetGameQuery(selectedGameId || "", {
    skip: !selectedGameId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-8 max-w-6xl animate-pulse space-y-6">
        <div className="h-9 w-32 bg-muted rounded-xl" />
        <div className="h-96 bg-muted rounded-3xl" />
      </div>
    );
  }

  if (isError || !game) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md space-y-4">
        <h2 className="text-2xl font-black">Game Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The requested game could not be retrieved from the catalog.
        </p>
        <Button onClick={() => dispatch(setCurrentView("catalog"))} className="rounded-xl">
          Back to Catalog
        </Button>
      </div>
    );
  }

  const inLibrary = isInLibrary(game.id);
  const entry = getEntryForGame(game.id);

  const handleStatusChange = async (newStatus: PlayStatus) => {
    if (entry) {
      await updateEntry(entry.id, { status: newStatus });
    }
  };

  const handleRatingChange = async (newRating: number) => {
    if (entry) {
      const finalRating = entry.rating === newRating ? null : newRating;
      await updateEntry(entry.id, { rating: finalRating });
    }
  };

  const handleRemove = async () => {
    if (entry && window.confirm("Remove this game from your personal library?")) {
      await removeEntry(entry.id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-8 max-w-6xl space-y-8">
      {/* Back button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch(setCurrentView("catalog"))}
          className="text-muted-foreground hover:text-foreground cursor-pointer -ml-2 rounded-xl"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Catalog
        </Button>
      </div>

      {/* Cinematic Hero Card */}
      <GameHeroBanner
        game={game}
        inLibrary={inLibrary}
        entry={entry}
        isAuthenticated={isAuthenticated}
        isMutating={isMutating}
        onLoginClick={openLoginModal}
        onAddToLibrary={addToLibrary}
      />

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
                <p className="font-bold text-sm text-foreground">{game.genres.join(", ")}</p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 space-y-1">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  Supported Platforms
                </span>
                <p className="font-bold text-sm text-foreground">{game.platforms.join(", ")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Library Management or Callout */}
        <div className="lg:col-span-1 space-y-6">
          <GameTrackingCard
            isAuthenticated={isAuthenticated}
            inLibrary={inLibrary}
            entry={entry}
            isMutating={isMutating}
            onStatusChange={handleStatusChange}
            onRatingChange={handleRatingChange}
            onRemove={handleRemove}
          />
        </div>
      </div>
    </div>
  );
}
