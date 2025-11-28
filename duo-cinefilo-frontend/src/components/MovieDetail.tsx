/**
 * Componente MovieDetail
 *
 * Muestra la página completa de detalle de una película:
 *  - Información de la película (título, año, duración, género…)
 *  - Calificación promedio
 *  - Descripción
 *  - Botones para compra y tráiler
 *  - Sección para que el usuario califique y comente
 *  - Listado de cines disponibles
 *
 * Props:
 *  - movie (Movie): Película seleccionada.
 *  - user (User|null): Usuario autenticado (si existe).
 *  - onBack(): Navega hacia la pantalla anterior.
 *  - onBuyTickets(cinema): Acción al comprar boletos.
 *  - onBuyMovie(): Acción al comprar película digital.
 *
 * Notas:
 *  - Maneja comentarios locales sin backend real.
 *  - Usa cines de ejemplo (MOCK_CINEMAS).
 */
import { useState } from 'react';
import { ArrowLeft, Star, Play, MapPin, ShoppingCart } from 'lucide-react';
import type { Movie, Cinema } from '../App';
import type { User } from '../App';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

type Comment = {
  id: string;
  user: string;
  rating: number;
  text: string;
  date: string;
};

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
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loadingCinetecas, setLoadingCinetecas] = useState(false);
  const [cinetecasError, setCinetecasError] = useState<string | null>(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const getCookie = (name: string) => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='))
      ?.split('=')[1];
  };

  useEffect(() => {
    const tokenCookie = getCookie('authToken');
    if (!tokenCookie) {
      setCinetecasError('Inicia sesión para ver los horarios.');
      setCinemas([]);
      return;
    }

    setLoadingCinetecas(true);
    setCinetecasError(null);

    const authHeader = decodeURIComponent(tokenCookie);
    const requestBody = { idpelicula: movie.id };

    console.log('Enviando al backend:', JSON.stringify(requestBody, null, 2));

    fetch(`${apiBaseUrl}/horarios/pelis/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(requestBody),
    })
      .then(async (res) => {
        const responseText = await res.text();
        console.log('Respuesta del backend:', responseText);
        
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${responseText}`);
        }
        return JSON.parse(responseText);
      })
      .then((data) => {
        const funciones = data.funciones || [];
        
        const cinemasData: { [key: string]: Cinema } = {};

        funciones.forEach((funcion: any) => {
          const cinetecaId = funcion.cineteca_id;
          if (!cinetecaId) return;

          if (!cinemasData[cinetecaId]) {
            cinemasData[cinetecaId] = {
              id: String(cinetecaId),
              name: funcion.cineteca__nombre,
              address: funcion.cineteca__direccion,
              horarios: [],
            };
          }
          
          const date = new Date(funcion.horario);
          const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          cinemasData[cinetecaId].horarios.push(formattedTime);
        });

        const mappedCinemas = Object.values(cinemasData);
        
        setCinemas(mappedCinemas);
        if (mappedCinemas.length === 0) {
            setCinetecasError('No hay funciones disponibles para esta película.');
        }
      })
      .catch((err) => {
        console.error('Error al cargar cinetecas:', err);
        setCinetecasError('Ocurrió un error al cargar los horarios.');
        setCinemas([]);
      })
      .finally(() => {
        setLoadingCinetecas(false);
      });
  }, [movie.id]);

  useEffect(() => {
    const tokenCookie = getCookie('authToken');
    if (!tokenCookie) {
      setHasToken(false);
      setComments([]);
      setOverallRating(Number(movie.rating) || 0);
      return;
    }

    setHasToken(true);
    setLoadingComments(true);

    const authHeader = decodeURIComponent(tokenCookie);

    fetch(`${apiBaseUrl}/comentario/get/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({ idpelicula: movie.id }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          throw new Error(`Error ${res.status}: ${txt}`);
        }
        return res.json();
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

      const tokenCookie = getCookie('authToken');
      const usernameCookie = getCookie('username');

      if (!tokenCookie || !usernameCookie) {
        alert('Debes iniciar sesión para publicar un comentario');
        return;
      }

      const authHeader = decodeURIComponent(tokenCookie);
      const idusuario = decodeURIComponent(usernameCookie);

      const calificacion = Math.max(0, Math.min(5, rating)) * 2;

      const payload: any = {
        idpelicula: movie.id,
        idusuario: idusuario,
        calificacion,
        comentario: newComment,
        texto: newComment,
      };

      const res = await fetch(`${apiBaseUrl}/comentario/make/`, {
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

      setLoadingComments(true);
      await fetch(`${apiBaseUrl}/comentario/get/`, {
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

      setNewComment("");
      setRating(0);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Ocurrió un error al publicar el comentario');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in">

      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <ImageWithFallback
          src={movie.imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />

        <Button
          variant="ghost"
          onClick={onBack}
          className="absolute top-6 left-6 text-foreground bg-background/50 hover:bg-background/80 backdrop-blur-sm rounded-full"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8 -mt-32 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-8">

            <div className="bg-card/50 backdrop-blur-lg border border-border/50 rounded-xl p-6 shadow-lg">
              <span className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-primary border border-primary rounded-full">
                {movie.genre.toUpperCase()}
              </span>

              <h1 className="text-foreground text-4xl md:text-5xl mb-4 font-bold break-words">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground mb-4">
                <span>{movie.year}</span>
                <span className="hidden md:inline">•</span>
                <span>{movie.duration}</span>
                <span className="hidden md:inline">•</span>
                <span className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  Dir. {movie.director}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
                <span className="text-foreground text-xl font-bold">{Number(overallRating).toFixed(1)}</span>
                <span className="text-muted-foreground">/ 10</span>
              </div>

              <h2 className="text-foreground text-2xl mb-4 font-bold">Sinopsis</h2>
              <p className="text-foreground/80 mb-6 leading-relaxed">{movie.description}</p>
              
              <div className="mt-6">
                <Button
                  onClick={onWatchTrailer}
                  className="bg-primary hover:bg-cinema-glow text-primary-foreground h-12 text-lg w-full sm:w-auto"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Ver trailer
                </Button>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-lg border border-border/50 rounded-xl p-6 shadow-lg">
              <h3 className="text-foreground text-2xl mb-6 font-bold">Comentarios</h3>

              {hasToken === false && (
                <div className="text-center text-muted-foreground mb-6 p-4 bg-secondary rounded-lg">
                  Para ver y publicar comentarios, por favor <span className="text-primary font-semibold">inicia sesión</span>.
                </div>
              )}

              {hasToken && (
                <>
                  <div className="mb-6 relative">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Escribe tu comentario..."
                      className="w-full h-28 p-3 bg-secondary border border-border/50 rounded-lg text-foreground resize-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="absolute bottom-3 right-3 flex gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={value}
                          onClick={() => setRating(value)}
                          className={`w-5 h-5 cursor-pointer transition-colors ${
                            value <= rating
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted-foreground hover:text-yellow-500"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || rating === 0}
                    className="bg-primary hover:bg-cinema-glow text-primary-foreground mb-8"
                  >
                    Publicar Comentario
                  </Button>
                </>
              )}

              {hasToken && (
                loadingComments ? (
                  <div className="text-muted-foreground text-center">Cargando comentarios...</div>
                ) : (
                  <div className="space-y-4">
                    {comments.length === 0 ? (
                      <div className="text-muted-foreground text-center">No hay comentarios aún. ¡Sé el primero!</div>
                    ) : (
                      comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-secondary border border-border/50 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-foreground">{comment.user}</span>
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                              <span className="text-foreground font-bold">
                                {comment.rating}
                              </span>
                            </div>
                          </div>
                          <p className="text-foreground/80 mb-2 text-sm">{comment.text}</p>
                          <span className="text-muted-foreground text-xs">
                            {comment.date}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card/50 backdrop-blur-lg border border-border/50 rounded-xl p-6 sticky top-24 shadow-lg">
              <h3 className="text-foreground text-xl mb-4 flex items-center gap-2 font-bold">
                <MapPin className="w-5 h-5 text-primary" />
                Funciones Disponibles
              </h3>

              <div className="space-y-4">
                {loadingCinetecas ? (
                  <p className="text-muted-foreground text-center">Cargando horarios...</p>
                ) : cinetecasError ? (
                  <p className="text-cinema-rose text-center">{cinetecasError}</p>
                ) : cinemas.length > 0 ? (
                  cinemas.map((cinema) => (
                    <div
                      key={cinema.id}
                      className="bg-secondary border border-border/50 rounded-lg p-4"
                    >
                      <div className="text-foreground font-semibold mb-1">{cinema.name}</div>
                      <div className="text-muted-foreground text-sm mb-3">
                        {cinema.address}
                      </div>
                      
                      {cinema.horarios && cinema.horarios.length > 0 ? (
                        <Tabs defaultValue={cinema.horarios[0]} className="w-full">
                          <TabsList className="flex flex-wrap gap-2 bg-transparent p-0 h-auto">
                            {cinema.horarios.map((hora) => (
                              <TabsTrigger
                                key={hora}
                                value={hora}
                                className="text-xs px-3 py-1.5 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                              >
                                {hora}
                              </TabsTrigger>
                            ))}
                          </TabsList>
                        </Tabs>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-2">No hay horarios disponibles.</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center">No hay funciones disponibles.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
