import { useEffect, useState } from 'react';
import type { Movie } from '../App';
import { MovieCard } from './MovieCard';

type SearchResultsProps = {
  query: string;
  onBackHome: () => void;
  onMovieSelect: (movie: Movie) => void;
};

type ApiMovie = {
  id: number | string;
  nombre: string;
  director: string;
  productora?: string;
  año: number;
  calificacion: number;
  poster: string; // apéndice de TMDB
  trailer?: string; // apéndice de YouTube
  sinopsis: string;
};

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const mapApiToMovie = (m: ApiMovie): Movie => ({
  id: String(m.id),
  title: m.nombre,
  director: m.director,
  description: m.sinopsis,
  genre: 'General',
  imageUrl: m.poster ? `${TMDB_IMAGE_BASE}${m.poster}` : 'https://via.placeholder.com/500x750?text=No+Image',
  price: 0,
  rating: m.calificacion ?? 0,
  year: Number(m.año) || 0,
  duration: '—',
  trailer: m.trailer,
});

export function SearchResults({ query, onBackHome, onMovieSelect }: SearchResultsProps) {
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCookie = (name: string) => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='))
      ?.split('=')[1];
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const q = (query || '').trim();
      if (!q) {
        setResults([]);
        return;
      }

      const tokenCookie = getCookie('authToken');
      if (!tokenCookie) {
        alert('para ver los mensajes, inicia sesion');
        return;
      }
      const authHeader = decodeURIComponent(tokenCookie);

      try {
        setLoading(true);
        setError(null);
        const res = await fetch('http://localhost:8000/peliculas/find/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader,
          },
          body: JSON.stringify({ nombre: q }),
        });
        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          throw new Error(`Error ${res.status}: ${txt}`);
        }
        const data = await res.json().catch(() => null);
        const items: any[] = Array.isArray(data)
          ? data
          : Array.isArray((data as any)?.results)
            ? (data as any).results
            : Array.isArray((data as any)?.peliculas)
              ? (data as any).peliculas
              : Array.isArray((data as any)?.movies)
                ? (data as any).movies
                : (data ? [data] : []);
        const mapped = items.map(mapApiToMovie);
        if (!cancelled) setResults(mapped);
      } catch (e: any) {
        console.error('Fallo la búsqueda (/peliculas/find/):', e);
        if (!cancelled) setError('No se pudieron cargar los resultados');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [query]);

  return (
    <div className="min-h-screen bg-background text-foreground pt-20 pb-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Resultados de búsqueda</h1>
          <button
            onClick={onBackHome}
            className="text-sm bg-primary hover:bg-cinema-glow text-primary-foreground px-4 py-2 rounded-full"
            title="Volver al inicio"
          >
            Volver al inicio
          </button>
        </div>

        {loading && <div className="text-muted-foreground">Cargando...</div>}
        {error && <div className="text-cinema-rose">{error}</div>}

        {!loading && !error && (
          results.length === 0 ? (
            <div className="text-muted-foreground">No hay resultados para "{query}"</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {results.map((m) => (
                <div key={m.id}>
                  <MovieCard movie={m} onClick={() => onMovieSelect(m)} />
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default SearchResults;
