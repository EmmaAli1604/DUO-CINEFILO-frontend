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
      className="group relative overflow-hidden rounded-lg bg-white/5 hover:bg-white/10 transition-all hover:scale-105"
    >
      <div className="aspect-2/3 overflow-hidden">
        <ImageWithFallback
          src={movie.imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-white mb-1 line-clamp-1">{movie.title}</h3>
        <p className="text-white/60 text-sm mb-2">{movie.director}</p>
        <div className="flex items-center justify-between">
          <span className="text-white/50 text-sm">{movie.year}</span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            <span className="text-white text-sm">{movie.rating}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
