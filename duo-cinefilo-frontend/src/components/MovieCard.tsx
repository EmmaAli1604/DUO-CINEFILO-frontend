/**
 * Componente MovieCard
 *
 * Representa una tarjeta visual individual de película dentro del catálogo.
 * Muestra imagen, título, calificación y permite seleccionar la película.
 *
 * Props:
 *  - movie (Movie): Objeto con la información de la película.
 *  - onClick: Función que se ejecuta cuando el usuario selecciona la tarjeta.
 *
 * Uso:
 *  Este componente se utiliza dentro de listas y carruseles de películas.
 */
import { Star } from 'lucide-react';
import type { Movie } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

type MovieCardProps = {
  movie: Movie;
  onClick: () => void;
};

export function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <button
      onClick={onClick}
      className="group h-full w-full text-left rounded-lg bg-secondary/50 overflow-hidden transition-all duration-300 hover:bg-secondary hover:scale-105"
    >
      <div className="aspect-[2/3] overflow-hidden">
        <ImageWithFallback
          src={movie.imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-3 space-y-1">
        <h3 className="text-foreground font-semibold truncate" title={movie.title}>
          {movie.title}
        </h3>
        <p className="text-muted-foreground text-sm truncate" title={movie.director}>
          {movie.director}
        </p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-muted-foreground text-xs">{movie.year}</span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-foreground text-sm font-bold">{movie.rating}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
