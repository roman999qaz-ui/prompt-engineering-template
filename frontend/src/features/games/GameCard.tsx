import type * as React from "react";
import { Check, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Game, LibraryEntry } from "@/types";

interface GameCardProps {
  game: Game;
  inLibrary: boolean;
  entry?: LibraryEntry;
  onCardClick: (gameId: string) => void;
  onLibraryAction: (e: React.MouseEvent, game: Game) => void;
}

export function GameCard({ game, inLibrary, entry, onCardClick, onLibraryAction }: GameCardProps) {
  return (
    <div
      onClick={() => onCardClick(game.id)}
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
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80";
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
              {entry.status.replace(/_/g, " ")}
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
                  {plat === "PlayStation" ? "PS" : plat === "Nintendo Switch" ? "Switch" : plat}
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
            variant={inLibrary ? "secondary" : "default"}
            className={`w-full text-xs h-8 cursor-pointer rounded-lg transition-all ${
              inLibrary
                ? "bg-secondary hover:bg-secondary/80 font-medium"
                : "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs"
            }`}
            onClick={(e) => onLibraryAction(e, game)}
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
  );
}
