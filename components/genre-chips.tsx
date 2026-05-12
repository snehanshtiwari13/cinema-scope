"use client";

interface GenreChipsProps {
  selectedGenre: number | null;
  onGenreSelect: (genreId: number | null) => void;
}

const GENRES = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 10749, name: "Romance" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
  { id: 16, name: "Animation" },
  { id: 10751, name: "Family" },
  { id: 99, name: "Documentary" },
];

export function GenreChips({ selectedGenre, onGenreSelect }: GenreChipsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <button
        onClick={() => onGenreSelect(null)}
        className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
          selectedGenre === null
            ? "border-primary bg-primary text-primary-foreground shadow-[0_0_15px_rgba(56,189,248,0.3)]"
            : "border-border bg-card/50 text-foreground hover:border-primary/50 hover:bg-primary/10"
        }`}
      >
        All
      </button>
      {GENRES.map((genre) => (
        <button
          key={genre.id}
          onClick={() => onGenreSelect(genre.id)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
            selectedGenre === genre.id
              ? "border-primary bg-primary text-primary-foreground shadow-[0_0_15px_rgba(56,189,248,0.3)]"
              : "border-border bg-card/50 text-foreground hover:border-primary/50 hover:bg-primary/10"
          }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}

export { GENRES };
