/**
 * Componente MovieCarousel
 *
 * Muestra una lista horizontal desplazable de tarjetas de películas.
 * Incluye botones laterales para facilitar la navegación.
 *
 * Props:
 *  - movies (Movie[]): Lista de películas a mostrar.
 *  - title (string): Título de la sección del carrusel.
 *  - onMovieSelect(movie): Función llamada cuando el usuario selecciona una película.
 *
 * Comportamiento:
 *  - Detecta automáticamente si se puede desplazar a izquierda o derecha.
 *  - Utiliza un contenedor con overflow horizontal.
 */
import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MovieCard } from './MovieCard';
import type { Movie } from '../App';

type MovieCarouselProps = {
  movies: Movie[];
  title: string;
  onMovieSelect: (movie: Movie) => void;
};

export function MovieCarousel({ movies, title, onMovieSelect }: MovieCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

    /**
   * Revisa si el contenedor permite desplazarse hacia izquierda o derecha.
   * Se ejecuta con cada scroll.
   */
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

    /**
   * Desplaza el carrusel suavemente hacia la izquierda o derecha.
   */
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className="relative group">
      <h2 className="text-white text-2xl mb-4 px-4 md:px-8">{title}</h2>
      
      {/* Botón izquierdo */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-2 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* Contenedor del carrusel */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="flex-none w-[200px] md:w-[250px]">
            <MovieCard movie={movie} onClick={() => onMovieSelect(movie)} />
          </div>
        ))}
      </div>

      {/* Botón derecho */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-2 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}