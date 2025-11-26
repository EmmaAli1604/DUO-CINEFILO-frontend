import { useEffect, useState } from 'react';
import { ArrowLeft, Star, Play, MapPin, Info } from 'lucide-react';
import type { Movie, Cinema } from '../App';
import type { User } from '../App';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";

const MOCK_CINEMAS: Cinema[] = [
  {
    id: '1',
    name: 'CineMax Plaza Central',
    address: 'Av. Principal 123',
    horarios: ['12:00', '15:30', '18:00', '20:45']
  },
  {
    id: '2',
    name: 'CineMax Mall Norte',
    address: 'Boulevard Norte 456',
    horarios: ['11:15', '14:00', '17:20', '21:00']
  },
  {
    id: '3',
    name: 'CineMax Centro',
    address: 'Calle Centro 789',
    horarios: ['10:45', '13:30', '16:10', '19:50', '22:15']
  }
];

type Comment = {
  id: string;
  user: string;
  rating: number;
  text: string;
  date: string;
};

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    user: 'María González',
    rating: 5,
    text: '¡Excelente película! La cinematografía es impresionante.',
    date: '2025-11-10'
  },
  {
    id: '2',
    user: 'Carlos Ruiz',
    rating: 4,
    text: 'Muy buena, aunque esperaba un poco más del final.',
    date: '2025-11-09'
  }
];

type MovieDetailProps = {
  movie: Movie;
  user: User | null;
  onBack: () => void;
  onWatchTrailer: () => void;
};

export function MovieDetail({ movie, user, onBack, onWatchTrailer }: MovieDetailProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [overallRating, setOverallRating] = useState<number>(Number(movie.rating) || 0);

  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);

  // Utilidad local para obtener cookies (mismo enfoque que en App.tsx)
  const getCookie = (name: string) => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='))
      ?.split('=')[1];
  };

  // Cargar comentarios reales desde el backend si hay token
  useEffect(() => {
    const tokenCookie = getCookie('authToken');
    if (!tokenCookie) {
      setHasToken(false);
      setComments([]);
      // Sin token, mantener/fallback a calificación local de la película
      setOverallRating(Number(movie.rating) || 0);
      return;
    }

    setHasToken(true);
    setLoadingComments(true);

    // Decodificar por si viene con caracteres escapados
    const authHeader = decodeURIComponent(tokenCookie);

    // Intentamos obtener comentarios de la API
    fetch('http://127.0.0.1:8000/comentario/get/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader, // Cookie ya guarda el prefijo "Bearer "
      },
      // Asumimos que el backend espera el id de la película en el body (nombre probable: idpelicula)
      body: JSON.stringify({ idpelicula: movie.id }),
    })
      .then(async (res) => {
        // Si no es ok, tratamos de leer el texto para facilitar depuración
        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          throw new Error(`Error ${res.status}: ${txt}`);
        }
        return res.json();
      })
      .then((data) => {
        // Flexibilidad de mapeo según posibles nombres de campos
        const list: any[] = Array.isArray(data)
          ? data
          : Array.isArray((data as any).results)
            ? (data as any).results
            : Array.isArray((data as any).comentarios)
              ? (data as any).comentarios
              : [];

        // Formatea una cadena de fecha para que muestre SOLO la parte de fecha (YYYY-MM-DD) cuando venga con hora
        const toDateOnly = (value: any): string => {
          try {
            const raw = String(value ?? '');
            if (!raw) return '';
            // 1) Coincidencia directa con formato ISO YYYY-MM-DD...
            const isoMatch = raw.match(/^(\d{4}-\d{2}-\d{2})/);
            if (isoMatch) return isoMatch[1];
            // 2) Si hay un espacio, tomar la primera parte y validar YYYY-MM-DD
            const first = raw.split(' ')[0];
            if (/^\d{4}-\d{2}-\d{2}$/.test(first)) return first;
            // 3) Si es parseable por Date, normalizar a YYYY-MM-DD
            const d = new Date(raw);
            if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
            // 4) Si ya es una fecha sin hora (p. ej. 25/11/2025), dejar como está
            return raw;
          } catch {
            return String(value ?? '');
          }
        };

        const mapped: Comment[] = list.map((item: any, idx: number) => {
          // Construcción del nombre: preferir usuario__nombre + usuario__apellido__paterno
          const nombre =
            item?.["usuario__nombre"] ?? item?.nombre ?? item?.first_name ?? item?.usuario?.nombre;
          const apellidoPaterno =
            item?.["usuario__apellido__paterno"] ?? item?.apellido_paterno ?? item?.last_name ?? item?.usuario?.apellido_paterno;
          const composedName =
            (nombre || apellidoPaterno)
              ? `${String(nombre || '').trim()} ${String(apellidoPaterno || '').trim()}`.trim()
              : undefined;

          return {
            id: String(item.id || item._id || idx),
            user: String(
              composedName || item.user || item.usuario || item.username || 'Usuario'
            ),
            rating: Number(item.rating ?? item.calificacion ?? 0),
            text: String(item.text || item.comentario || item.texto || ''),
            date: toDateOnly(item.date ?? item.fecha ?? new Date().toISOString().slice(0, 10)),
          };
        });

        setComments(mapped);

        // Calcular/leer calificación general para mostrar junto a la estrella principal
        const topCalif =
          Number((data as any).calificacion ?? (data as any).rating ?? (data as any).promedio ?? NaN);
        if (!Number.isNaN(topCalif) && topCalif > 0) {
          setOverallRating(topCalif);
        } else if (mapped.length > 0) {
          const avg = mapped.reduce((acc, c) => acc + (Number(c.rating) || 0), 0) / mapped.length;
          setOverallRating(Number.isFinite(avg) ? avg : (Number(movie.rating) || 0));
        } else {
          setOverallRating(Number(movie.rating) || 0);
        }
      })
      .catch((err) => {
        console.error('No se pudieron cargar los comentarios:', err);
        setComments([]);
        setOverallRating(Number(movie.rating) || 0);
      })
      .finally(() => setLoadingComments(false));
  }, [movie.id]);

  const handleAddComment = async () => {
    try {
      if (!newComment.trim()) return;
      if (rating === 0) return;

      // Obtener cookies necesarias
      const tokenCookie = getCookie('authToken');
      const usernameCookie = getCookie('username');

      if (!tokenCookie || !usernameCookie) {
        alert('Debes iniciar sesión para publicar un comentario');
        return;
      }

      const authHeader = decodeURIComponent(tokenCookie);
      const idusuario = decodeURIComponent(usernameCookie);

      // Mapeo de estrellas (0..5) a calificación requerida (0,2,4,6,8,10)
      const calificacion = Math.max(0, Math.min(5, rating)) * 2;

      const payload: any = {
        idpelicula: movie.id,
        idusuario: idusuario,
        calificacion,
        comentario: newComment,
        texto: newComment, // fallback por si el backend usa otra clave
      };

      const res = await fetch('http://127.0.0.1:8000/comentario/make/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`No se pudo publicar el comentario (${res.status}): ${txt}`);
      }

      // Intentar refrescar comentarios desde el backend para mantener consistencia
      setLoadingComments(true);
      await fetch('http://127.0.0.1:8000/comentario/get/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify({ idpelicula: movie.id }),
      })
        .then(async (r) => {
          if (!r.ok) {
            const txt = await r.text().catch(() => '');
            throw new Error(`Error ${r.status}: ${txt}`);
          }
          return r.json();
        })
        .then((data) => {
          const list: any[] = Array.isArray(data)
            ? data
            : Array.isArray((data as any).results)
              ? (data as any).results
              : Array.isArray((data as any).comentarios)
                ? (data as any).comentarios
                : [];

          const toDateOnly = (value: any): string => {
            try {
              const raw = String(value ?? '');
              if (!raw) return '';
              const isoMatch = raw.match(/^(\d{4}-\d{2}-\d{2})/);
              if (isoMatch) return isoMatch[1];
              const first = raw.split(' ')[0];
              if (/^\d{4}-\d{2}-\d{2}$/.test(first)) return first;
              const d = new Date(raw);
              if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
              return raw;
            } catch {
              return String(value ?? '');
            }
          };

          const mapped: Comment[] = list.map((item: any, idx: number) => {
            const nombre =
              item?.["usuario__nombre"] ?? item?.nombre ?? item?.first_name ?? item?.usuario?.nombre;
            const apellidoPaterno =
              item?.["usuario__apellido__paterno"] ?? item?.apellido_paterno ?? item?.last_name ?? item?.usuario?.apellido_paterno;
            const composedName =
              (nombre || apellidoPaterno)
                ? `${String(nombre || '').trim()} ${String(apellidoPaterno || '').trim()}`.trim()
                : undefined;

            return {
              id: String(item.id || item._id || idx),
              user: String(
                composedName || item.user || item.usuario || item.username || 'Usuario'
              ),
              rating: Number(item.rating ?? item.calificacion ?? 0),
              text: String(item.text || item.comentario || item.texto || ''),
              date: toDateOnly(item.date ?? item.fecha ?? new Date().toISOString().slice(0, 10)),
            };
          });

          setComments(mapped);

          const topCalif =
            Number((data as any).calificacion ?? (data as any).rating ?? (data as any).promedio ?? NaN);
          if (!Number.isNaN(topCalif) && topCalif > 0) {
            setOverallRating(topCalif);
          } else if (mapped.length > 0) {
            const avg = mapped.reduce((acc, c) => acc + (Number(c.rating) || 0), 0) / mapped.length;
            setOverallRating(Number.isFinite(avg) ? avg : (Number(movie.rating) || 0));
          } else {
            setOverallRating(Number(movie.rating) || 0);
          }
        })
        .catch((e) => {
          console.error('No se pudieron refrescar los comentarios tras publicar:', e);
        })
        .finally(() => setLoadingComments(false));

      // Limpiar inputs después de publicar
      setNewComment("");
      setRating(0);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Ocurrió un error al publicar el comentario');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Hero */}
      <div className="relative h-[500px] overflow-hidden">
        <ImageWithFallback
          src={movie.imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <Button
          variant="ghost"
          onClick={onBack}
          className="absolute top-4 left-4 text-foreground hover:bg-card/50"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver
        </Button>
      </div>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">

            {/* Movie Info */}
            <div>
              <span className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-cinema-rose border border-cinema-rose rounded-full">
                {movie.genre.toUpperCase()}
              </span>

              <h1 className="text-foreground text-4xl mb-4 font-playfair-display">
                {movie.title}
              </h1>

              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <span>{movie.year}</span>
                <span>•</span>
                <span>{movie.duration}</span>
                <span>•</span>
                <span className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-cinema-rose" />
                  Dir. {movie.director}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
                <span className="text-foreground text-xl">{Number(overallRating).toFixed(1)}</span>
                <span className="text-muted-foreground">/ 10</span>
              </div>

              <h2 className="text-foreground text-2xl mb-4">Sinopsis</h2>
              <p className="text-foreground/80 mb-6">{movie.description}</p>
            </div>

            {/* Trailer Button */}
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                onClick={onWatchTrailer}
                className="bg-primary hover:bg-cinema-glow text-primary-foreground h-12 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Ver trailer
              </Button>
            </div>

            {/* Bloque "Tu Calificación" eliminado por redundancia con la calificación al publicar comentarios */}

            {/* COMMENTS SECTION */}
            <div>
              <h3 className="text-foreground text-2xl mb-6">Comentarios</h3>

              {/* Si no hay token, mostrar mensaje y no renderizar listado */}
              {hasToken === false && (
                <div className="text-muted-foreground mb-6">para ver los mensajes, inicia sesion</div>
              )}

              {/* Textarea + Rating */}
              <div className="mb-6 relative">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe tu comentario..."
                  disabled={hasToken === false}
                  className={`w-full h-32 p-3 bg-card border border-border/50 rounded-lg text-foreground resize-none pr-20 ${hasToken === false ? 'opacity-60 cursor-not-allowed' : ''}`}
                />

                <div className="absolute bottom-2 right-3 flex gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      onClick={() => hasToken !== false && setRating(value)}
                      className={`w-5 h-5 ${hasToken === false ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} transition ${
                        value <= rating
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <Button
                onClick={handleAddComment}
                disabled={hasToken === false || !newComment.trim() || rating === 0}
                className="bg-primary hover:bg-cinema-glow text-primary-foreground mb-5"
              >
                Publicar Comentario
              </Button>

              {/* Comments List */}
              {hasToken ? (
                loadingComments ? (
                  <div className="text-muted-foreground">Cargando comentarios...</div>
                ) : (
                  <div className="space-y-4">
                    {comments.length === 0 ? (
                      <div className="text-muted-foreground">No hay comentarios.</div>
                    ) : (
                      comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-card border border-border/50 rounded-lg p-6"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-foreground">{comment.user}</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                              <span className="text-foreground">
                                {comment.rating}
                              </span>
                            </div>
                          </div>

                          <p className="text-foreground/80 mb-2">{comment.text}</p>
                          <span className="text-muted-foreground text-sm">
                            {comment.date}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )
              ) : null}
            </div>
          </div>

          {/* SIDEBAR CINEMAS */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border/50 rounded-lg p-6 sticky top-24">
              <h3 className="text-foreground text-xl mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cinema-rose" />
                Cinetecas más cercanas
              </h3>

              <div className="space-y-3">
                {MOCK_CINEMAS.map((cinema) => (
                  <button
                    key={cinema.id}
                    className="w-full bg-secondary/50 hover:bg-secondary border border-border/50 rounded-lg p-4 text-left transition-colors"
                  >
                    <div className="text-foreground mb-1">{cinema.name}</div>
                    <div className="text-muted-foreground text-sm mb-2">
                      {cinema.address}
                    </div>

                    <Tabs defaultValue={cinema.horarios[0]} className="w-full">
                      <TabsList className="flex flex-wrap gap-2 bg-transparent p-0">
                        {cinema.horarios.map((hora) => (
                          <TabsTrigger
                            key={hora}
                            value={hora}
                            className="text-sm px-3 py-1 rounded-full"
                          >
                            {hora}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {cinema.horarios.map((hora) => (
                        <TabsContent key={hora} value={hora}>
                          <div className="text-sm text-muted-foreground">
                            Función a las {hora}
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </button>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
