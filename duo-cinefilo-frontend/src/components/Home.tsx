import { useState, useEffect, useRef } from 'react';
import { MovieCarousel } from './MovieCarousel';
import type { Movie, User } from '../App';
import { Search, User as UserIcon, LogOut, Play, Info, TrendingUp, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import logo from '../assets/logo.png';

// Datos mock originales (se mantienen como respaldo/fallback)
const MOCK_MOVIES: Movie[] = [
    {
        id: '1',
        title: 'El Padrino',
        director: 'Francis Ford Coppola',
        description: 'La historia de la familia Corleone, una de las más poderosas de Nueva York.',
        genre: 'Drama',
        imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
        price: 4.99,
        rating: 4.8,
        year: 1972,
        duration: '2h 55m'
    },
    {
        id: '2',
        title: 'Inception',
        director: 'Christopher Nolan',
        description: 'Un ladrón que roba secretos a través de los sueños.',
        genre: 'Ciencia Ficción',
        imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500',
        price: 5.99,
        rating: 4.7,
        year: 2010,
        duration: '2h 28m'
    },
    {
        id: '3',
        title: 'Parasite',
        director: 'Bong Joon-ho',
        description: 'Una familia pobre se infiltra en la vida de una familia rica.',
        genre: 'Thriller',
        imageUrl: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=500',
        price: 4.99,
        rating: 4.9,
        year: 2019,
        duration: '2h 12m'
    },
    {
        id: '4',
        title: 'La La Land',
        director: 'Damien Chazelle',
        description: 'Una historia de amor en Los Ángeles.',
        genre: 'Musical',
        imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500',
        price: 3.99,
        rating: 4.5,
        year: 2016,
        duration: '2h 8m'
    },
    {
        id: '5',
        title: 'The Dark Knight',
        director: 'Christopher Nolan',
        description: 'Batman enfrenta al Joker en una batalla psicológica.',
        genre: 'Acción',
        imageUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500',
        price: 5.99,
        rating: 4.9,
        year: 2008,
        duration: '2h 32m'
    },
    {
        id: '6',
        title: 'Amélie',
        director: 'Jean-Pierre Jeunet',
        description: 'Una joven francesa ayuda a otros a encontrar la felicidad.',
        genre: 'Romance',
        imageUrl: 'https://images.unsplash.com/photo-1574267432644-f610cab6aabb?w=500',
        price: 3.99,
        rating: 4.6,
        year: 2001,
        duration: '2h 2m'
    },
    {
        id: '7',
        title: 'Interstellar',
        director: 'Christopher Nolan',
        description: 'Exploradores viajan por un agujero de gusano.',
        genre: 'Ciencia Ficción',
        imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=500',
        price: 5.99,
        rating: 4.8,
        year: 2014,
        duration: '2h 49m'
    },
    {
        id: '8',
        title: 'Pulp Fiction',
        director: 'Quentin Tarantino',
        description: 'Historias entrelazadas de criminales en Los Ángeles.',
        genre: 'Drama',
        imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500',
        price: 4.99,
        rating: 4.7,
        year: 1994,
        duration: '2h 34m'
    }
];

// Las categorías (tags) se obtendrán dinámicamente desde el backend.
// Mantenemos 'Todos' como la opción por defecto.

type HomeProps = {
    user: User | null;
    onMovieSelect: (movie: Movie) => void;
    onNavigate: (page: 'home' | 'login' | 'register') => void;
    onLogout: () => void;
    onStartSearch: (query: string) => void;
};

export function Home({ user, onMovieSelect, onNavigate, onLogout, onStartSearch }: HomeProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('Todos');
    const [featuredMovie, setFeaturedMovie] = useState(MOCK_MOVIES[0]);
    const [scrolled, setScrolled] = useState(false);
    const [movies, setMovies] = useState<Movie[]>(MOCK_MOVIES);
    // Tipo para etiquetas provenientes del backend
    type Tag = { id: string | null; nombre: string };
    const [categories, setCategories] = useState<Tag[]>([{ id: null, nombre: 'Todos' }]);
    const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
    // Estado para resultados por etiqueta
    const [taggedMovies, setTaggedMovies] = useState<Movie[] | null>(null);
    const [loadingTagged, setLoadingTagged] = useState(false);
    const [taggedError, setTaggedError] = useState<string | null>(null);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    // Búsqueda contra backend
    const [searchMovies, setSearchMovies] = useState<Movie[] | null>(null);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [searchActive, setSearchActive] = useState(false);

    // Constantes para construir URLs desde la API
    const API_URL = `${apiBaseUrl}/peliculas/all`;
    // Endpoint para obtener etiquetas desde el backend (se usa en el montaje)
    const TAGS_URL = `${apiBaseUrl}/peliculas/tags`;
    const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
    const YT_WATCH_BASE = 'https://www.youtube.com/watch?v='; // por si luego lo usamos

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

    // Adaptador de la API al tipo Movie de la app
    const mapApiToMovie = (m: ApiMovie): Movie => ({
        id: String(m.id),
        title: m.nombre,
        director: m.director,
        description: m.sinopsis,
        genre: 'General', // la API no provee género
        imageUrl: m.poster ? `${TMDB_IMAGE_BASE}${m.poster}` : 'https://via.placeholder.com/500x750?text=No+Image',
        price: 0, // no provisto por la API
        rating: m.calificacion ?? 0,
        year: Number(m.año) || 0,
        duration: '—', // no provisto por la API
        trailer: m.trailer, // ID de YouTube opcional
    });

    // Utilidad local para leer cookies (similar a App/MovieDetail)
    const getCookie = (name: string) => {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith(name + '='))
            ?.split('=')[1];
    };

    // Cargar películas desde la API al montar
    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const res = await fetch(API_URL);
                if (!res.ok) throw new Error(`Error ${res.status}`);
                const data = await res.json();
                // Soporta tanto array como objeto único
                const list: ApiMovie[] = Array.isArray(data) ? data : [data];
                const mapped = list.map(mapApiToMovie);
                if (!cancelled && mapped.length > 0) {
                    setMovies(mapped);
                    setFeaturedMovie(mapped[0]);
                }
            } catch (e) {
                console.error('No se pudieron cargar las películas desde la API, usando datos locales.', e);
            }
        };
        load();
        return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Cargar categorías (tags) desde el backend al montar
    useEffect(() => {
        let cancelled = false;
        const loadTags = async () => {
            try {
                const res = await fetch(TAGS_URL, { method: 'GET' });
                if (!res.ok) throw new Error(`Error ${res.status}`);
                const data = await res.json();
                // El backend actual responde un objeto con la forma:
                // { total: number, etiquetas: [{ id_etiqueta, nombre }, ...] }
                // Ajustamos el parser para priorizar ese formato y mantener compatibilidad con otros.

                const etiquetas = Array.isArray((data as any)?.etiquetas)
                    ? (data as any).etiquetas
                    : (Array.isArray(data) ? data : []);

                const parsed: Tag[] = etiquetas
                    .map((item: any) => {
                        if (typeof item === 'string') {
                            const nombre = item.trim();
                            if (!nombre) return null;
                            return { id: null, nombre } as Tag;
                        }
                        if (!item) return null;
                        const nombre: string = String(
                            item.nombre ?? item.name ?? item.tag ?? item.titulo ?? ''
                        ).trim();
                        if (!nombre) return null;
                        // Priorizar id_etiqueta; mantener compatibilidad con claves previas
                        const idRaw = item.id_etiqueta ?? item.idetiqueta ?? item.id ?? item.pk ?? null;
                        const id = idRaw != null ? String(idRaw) : null;
                        return { id, nombre } as Tag;
                    })
                    .filter((t: Tag | null): t is Tag => !!t);
                console.log(parsed);
                // No eliminar duplicados: el backend garantiza que no vienen repetidos
                if (!cancelled) {
                    const all: Tag[] = [{ id: null, nombre: 'Todos' }, ...parsed];
                    setCategories(all);
                    // Asegurar consistencia del seleccionado
                    if (!all.some(t => t.nombre === selectedGenre)) {
                        setSelectedGenre('Todos');
                        setSelectedTagId(null);
                    }
                }
            } catch (e) {
                console.error('No se pudieron cargar las categorías desde el backend, usando lista por defecto.', e);
                if (!cancelled) {
                    // Dejar únicamente 'Todos' como fallback sin romper la UI
                    setCategories([{ id: null, nombre: 'Todos' }]);
                    setSelectedTagId(null);
                }
            }
        };
        loadTags();
        return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // =========================
    // Secciones dinámicas por 2 etiquetas aleatorias
    // =========================
    type RandomSection = {
        id: string;
        nombre: string;
        movies: Movie[];
        loading: boolean;
        error: string | null;
    };
    const [randomSections, setRandomSections] = useState<RandomSection[]>([]);

    const fetchMoviesByTag = async (idTag: string | number): Promise<Movie[]> => {
        try {
            const idValue = ((): number | string => {
                const n = Number(idTag);
                return Number.isFinite(n) ? n : String(idTag);
            })();
            const res = await fetch(`${apiBaseUrl}/peliculas/tag/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idetiqueta: idValue }),
            });
            if (!res.ok) {
                console.error('Fallo al cargar películas por etiqueta aleatoria:', res.status);
                return [];
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
                            : [];
            return items.map(mapApiToMovie);
        } catch (e) {
            console.error('Error inesperado al cargar películas por etiqueta aleatoria:', e);
            return [];
        }
    };

    // Cuando se cargan las categorías, elegir 2 aleatorias (distintas) y cargar sus películas
    useEffect(() => {
        const pool = categories.filter((t) => t.id != null);
        if (pool.length === 0) {
            setRandomSections([]);
            return;
        }
        // Elegir hasta 2 distintas
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        const picked = shuffled.slice(0, Math.min(2, shuffled.length));

        const initial: RandomSection[] = picked.map((t) => ({
            id: String(t.id!),
            nombre: t.nombre,
            movies: [],
            loading: true,
            error: null,
        }));
        setRandomSections(initial);

        // Cargar películas para cada una
        picked.forEach(async (t) => {
            const movies = await fetchMoviesByTag(t.id!);
            setRandomSections((prev) => prev.map((sec) =>
                sec.id === String(t.id!)
                    ? { ...sec, movies, loading: false, error: movies.length === 0 ? 'Sin resultados' : null }
                    : sec
            ));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categories]);

    // Cambiar película destacada cada 8 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            const pool = movies.length > 0 ? movies : MOCK_MOVIES;
            const randomIndex = Math.floor(Math.random() * pool.length);
            setFeaturedMovie(pool[randomIndex]);
        }, 8000);
        return () => clearInterval(interval);
    }, [movies]);

    // Detectar scroll para cambiar el header
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const filteredMovies = (movies || []).filter((movie) => {
        const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = selectedGenre === 'Todos' || movie.genre === selectedGenre;
        return matchesSearch && matchesGenre;
    });

    const topRatedMovies = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 6);

    // Abrir trailer en nueva pestaña si existe; si no, notificar
    const openTrailer = (movie: Movie) => {
        const raw = (movie.trailer || '').trim();
        if (!raw) {
            alert('no se encontro el link al trailer');
            return;
        }
        // Si ya es una URL completa, úsala; si parece ser un ID de YouTube, construir la URL
        const isUrl = /^https?:\/\//i.test(raw);
        const url = isUrl ? raw : `https://www.youtube.com/watch?v=${encodeURIComponent(raw)}`;
        const win = window.open(url, '_blank', 'noopener,noreferrer');
        if (win) win.opener = null;
    };

    return (
        // Usa bg-background para asegurar el color negro/burdeos
        <div className="min-h-screen bg-background">

            {/* HEADER ELEGANTE */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled
                    ? 'bg-card/95 backdrop-blur-xl shadow-lg'
                    : 'bg-gradient-to-b from-background/80 to-transparent'
            }`}>
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <div
                            className="flex items-center gap-2 cursor-pointer group"
                            onClick={() => onNavigate('home')}
                        >
                            <img
                                src={logo}
                                alt="Duo-Cinefilo"
                                className="h-8 md:h-10 transition-transform group-hover:scale-110"
                            />
                        </div>

                        {/* Búsqueda */}
                        <div className="hidden md:flex items-center gap-2 bg-secondary/50 backdrop-blur-sm rounded-full px-5 py-2.5 flex-1 max-w-md mx-8 border border-border/50 focus-within:border-primary transition-all">
                            <Search className="w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Buscar películas..."
                                value={searchQuery}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setSearchQuery(v);
                                    if (!v.trim()) {
                                        // Limpiar resultados cuando se borra la búsqueda
                                        setSearchActive(false);
                                        setSearchMovies(null);
                                        setSearchError(null);
                                        setLoadingSearch(false);
                                    }
                                }}
                                onKeyDown={async (e) => {
                                    if (e.key !== 'Enter') return;
                                    const query = searchQuery.trim();
                                    if (!query) {
                                        setSearchActive(false);
                                        setSearchMovies(null);
                                        setSearchError(null);
                                        return;
                                    }
                                    // Navegar a la vista de resultados dedicada
                                    onStartSearch(query);
                                }}
                                className="bg-transparent text-foreground outline-none flex-1 placeholder:text-muted-foreground"
                            />
                            {/* El botón 'Volver al inicio' ahora vive en el componente SearchResults */}
                        </div>

                        {/* Usuario */}
                        <div className="flex items-center gap-3">
                            {user ? (
                                <>
                                    <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors">
                                        <UserIcon className="w-5 h-5 text-foreground" />
                                        <span className="text-foreground font-medium">hola, {user.name}</span>
                                    </div>
                                    {/* Botón Salir usando primary/cinema-rose */}
                                    <button
                                        onClick={onLogout}
                                        className="flex items-center gap-2 bg-primary hover:bg-cinema-glow text-primary-foreground px-4 py-2 rounded-full transition-all shadow-lg hover:shadow-primary/50"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="hidden md:inline">Salir</span>
                                    </button>
                                </>
                            ) : (
                                /* Botón Iniciar Sesión usando primary/cinema-rose */
                                <button
                                    onClick={() => onNavigate('login')}
                                    className="flex items-center gap-2 bg-primary hover:bg-cinema-glow text-primary-foreground px-6 py-2.5 rounded-full transition-all shadow-lg hover:shadow-primary/50 font-medium"
                                >
                                    <UserIcon className="w-4 h-4" />
                                    <span>Iniciar Sesión</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* HERO SECTION PREMIUM */}
            <div className="relative h-[85vh] md:h-[90vh] overflow-hidden">
                {/* Imagen de fondo */}
                <div className="absolute inset-0">
                    <img
                        src={featuredMovie.imageUrl}
                        alt={featuredMovie.title}
                        className="w-full h-full object-cover animate-fade-in"
                        key={featuredMovie.id}
                    />
                    {/* Gradientes mejorados: USAR VARIABLES CSS para colores Cineteca */}
                    <div
                        className="absolute inset-0"
                        style={{
                            // Gradiente de izquierda a derecha para enfocar el texto
                            background: 'linear-gradient(to right, hsl(var(--cinema-black)) 0%, hsl(var(--cinema-black) / 0.7) 40%, transparent 100%)'
                        }}
                    />
                    <div
                        className="absolute inset-0"
                        style={{
                            // Gradiente de abajo hacia arriba para oscurecer la base
                            background: 'linear-gradient(to top, hsl(var(--cinema-black)) 0%, transparent 100%)'
                        }}
                    />
                </div>

                {/* Contenido del hero */}
                <div className="relative h-full flex items-center">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="max-w-2xl space-y-6 pt-16">
                            {/* Badge de destacado usando cinema-rose */}
                            <div className="flex items-center gap-2 text-cinema-rose">
                                <Sparkles className="w-5 h-5" />
                                <span className="text-sm font-semibold uppercase tracking-wider">Destacado</span>
                            </div>

                            {/* Título - Usa text-foreground (cinema-cream) */}
                            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight animate-slide-up-fade break-words">
                                {featuredMovie.title}
                            </h1>

                            {/* Metadata */}
                            <div className="flex items-center gap-4 text-foreground/80">
                <span className="flex items-center gap-1 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                  ⭐ {featuredMovie.rating}
                </span>
                                <span>{featuredMovie.year}</span>
                                <span>•</span>
                                <span>{featuredMovie.duration}</span>
                                <span>•</span>
                                {/* Género usando cinema-rose */}
                                <span className="text-cinema-rose">{featuredMovie.genre}</span>
                            </div>

                            {/* Descripción */}
                            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed max-w-xl">
                                {featuredMovie.description}
                            </p>

                            {/* Botones de acción */}
                            <div className="flex flex-wrap gap-4 pt-4">
                                {/* Botón Reproducir usando primary (cinema-rose) y glow shadow */}
                                <button
                                    onClick={() => openTrailer(featuredMovie)}
                                    className="flex items-center gap-3 bg-primary hover:bg-cinema-glow text-primary-foreground px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:scale-105"
                                    style={{ boxShadow: 'var(--shadow-glow)' }}
                                >
                                    <Play className="w-6 h-6 fill-current" />
                                    Reproducir
                                </button>
                                {/* Botón Más Info usando secondary (cinema-burgundy oscuro) */}
                                <button
                                    onClick={() => onMovieSelect(featuredMovie)}
                                    className="flex items-center gap-3 bg-secondary/50 hover:bg-secondary backdrop-blur-sm text-foreground px-8 py-4 rounded-full font-bold text-lg transition-all border border-border/50"
                                >
                                    <Info className="w-6 h-6" />
                                    Más info
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Indicador de scroll */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-border/30 rounded-full flex items-start justify-center p-2">
                        <div className="w-1.5 h-3 bg-foreground/50 rounded-full" />
                    </div>
                </div>
            </div>

            {/* FILTROS DE GÉNERO / ETIQUETAS */}
            <div className="sticky top-16 md:top-20 z-40 bg-gradient-to-b from-background via-background to-transparent py-6 backdrop-blur-sm">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((tag) => (
                            <button
                                key={tag.id ?? tag.nombre}
                                onClick={async () => {
                                    setSelectedGenre(tag.nombre);
                                    setSelectedTagId(tag.id);
                                    // Si es "Todos", no llamamos al endpoint
                                    if (tag.id === null || tag.id === undefined) {
                                        // Limpiar resultados por etiqueta
                                        setTaggedMovies(null);
                                        setTaggedError(null);
                                        setLoadingTagged(false);
                                        return;
                                    }

                                    try {
                                        // Corrección solicitada: usar POST a /peliculas/tag/ con JSON { idetiqueta }
                                        // No enviar headers de autenticación.
                                        setLoadingTagged(true);
                                        setTaggedError(null);
                                        const idValue = ((): number | string => {
                                            const n = Number(tag.id);
                                            return Number.isFinite(n) ? n : String(tag.id);
                                        })();
                                        const res = await fetch(`${apiBaseUrl}/peliculas/tag/`, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({ idetiqueta: idValue }),
                                        });
                                        if (!res.ok) {
                                            const txt = await res.text().catch(() => '');
                                            console.error(`Error al solicitar por etiqueta (${res.status}):`, txt);
                                            setTaggedError(`No se pudieron cargar las películas de la etiqueta (${res.status})`);
                                            setTaggedMovies([]);
                                        } else {
                                            const data = await res.json().catch(() => null);
                                            console.log('Respuesta backend /peliculas/tag/:', data);
                                            // El backend podría devolver un arreglo directo o un objeto con una propiedad lista
                                            const items: any[] = Array.isArray(data)
                                                ? data
                                                : Array.isArray((data as any)?.results)
                                                    ? (data as any).results
                                                    : Array.isArray((data as any)?.peliculas)
                                                        ? (data as any).peliculas
                                                        : Array.isArray((data as any)?.movies)
                                                            ? (data as any).movies
                                                            : [];
                                            const mapped = items.map(mapApiToMovie);
                                            setTaggedMovies(mapped);
                                        }
                                    } catch (e) {
                                        console.error('Fallo la petición de etiquetas (POST /peliculas/tag/):', e);
                                        setTaggedError('Ocurrió un error al cargar las películas de la etiqueta');
                                        setTaggedMovies([]);
                                    } finally {
                                        setLoadingTagged(false);
                                    }
                                }}
                                className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                                    selectedGenre === tag.nombre
                                        // Botón activo: usa primary (cinema-rose) y glow shadow
                                        ? 'bg-primary text-primary-foreground shadow-lg shadow-cinema-rose/30 scale-105'
                                        // Botón inactivo: usa secondary (dark burgundy) y border
                                        : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border'
                                }`}
                            >
                                {tag.nombre}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            {/* CARRUSELES DE PELÍCULAS */}
            <div className="space-y-12 py-8 pb-20">
                {selectedTagId ? (
                    <>
                        <div className="space-y-4">
                            <div className="container mx-auto px-4 lg:px-8">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="w-6 h-6 text-cinema-rose" />
                                    <h2 className="text-foreground text-2xl font-semibold">
                                        {selectedGenre}
                                    </h2>
                                </div>
                            </div>
                            <div className="container mx-auto px-0 md:px-8">
                                {loadingTagged ? (
                                    <div className="text-muted-foreground px-4">Cargando películas...</div>
                                ) : taggedError ? (
                                    <div className="text-cinema-rose px-4">{taggedError}</div>
                                ) : (
                                    (() => {
                                        const list = (taggedMovies || []).filter((m) =>
                                            m.title.toLowerCase().includes(searchQuery.toLowerCase())
                                        );
                                        if (list.length === 0) {
                                            return <div className="text-muted-foreground px-4">No hay películas para esta etiqueta.</div>;
                                        }
                                        return (
                                            <MovieCarousel
                                                movies={list}
                                                title={''}
                                                onMovieSelect={onMovieSelect}
                                            />
                                        );
                                    })()
                                )}
                            </div>
                        </div>
                    </>
                ) : (selectedGenre === 'Todos' || searchActive) ? (
                    <>
                        {/* Top Rated con badge especial */}
                        <div className="space-y-4">
                            <div className="container mx-auto px-4 lg:px-8">
                                <div className="flex items-center gap-3">
                                    {/* TrendingUp en cinema-rose */}
                                    <TrendingUp className="w-6 h-6 text-cinema-rose" />
                                    <h2 className="text-foreground text-2xl md:text-3xl font-bold">Top Películas</h2>
                                </div>
                            </div>
                            <MovieCarousel
                                movies={topRatedMovies}
                                title=""
                                onMovieSelect={onMovieSelect}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="container mx-auto px-4 lg:px-8">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="w-6 h-6 text-cinema-rose" />
                                    <h2 className="text-foreground text-2xl md:text-3xl font-bold">Populares</h2>
                                </div>
                            </div>
                            <MovieCarousel
                                movies={movies}
                                title=""
                                onMovieSelect={onMovieSelect}
                            />
                        </div>

                        {/* Secciones dinámicas por etiquetas aleatorias */}
                        {randomSections.map((sec) => (
                            <div key={sec.id} className="space-y-4">
                                <div className="container mx-auto px-4 lg:px-8">
                                    <div className="flex items-center gap-3">
                                        <Sparkles className="w-6 h-6 text-cinema-rose" />
                                        <h2 className="text-foreground text-2xl md:text-3xl font-bold">{sec.nombre}</h2>
                                    </div>
                                </div>
                                {sec.loading ? (
                                    <div className="text-muted-foreground px-4">Cargando películas...</div>
                                ) : sec.error ? (
                                    <div className="text-cinema-rose px-4">{sec.error}</div>
                                ) : (
                                    <MovieCarousel
                                        movies={sec.movies.filter((m) => m.title.toLowerCase().includes(searchQuery.toLowerCase()))}
                                        title=""
                                        onMovieSelect={onMovieSelect}
                                    />
                                )}
                            </div>
                        ))}
                    </>
                ) : (
                    <MovieCarousel
                        movies={filteredMovies}
                        title={`${selectedGenre}`}
                        onMovieSelect={onMovieSelect}
                    />
                )}
            </div>

            {/* FOOTER MODERNO */}
            <footer className="bg-gradient-to-t from-background to-transparent border-t border-border py-12">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <img src={logo} alt="CineMax" className="h-10 mb-4" />
                            <p className="text-muted-foreground text-sm">
                                La mejor experiencia cinematográfica en tu hogar
                            </p>
                        </div>
                        <div>
                            <h3 className="text-foreground font-semibold mb-4">Navegación</h3>
                            <ul className="space-y-2 text-muted-foreground text-sm">
                                <li className="hover:text-foreground cursor-pointer transition-colors">Inicio</li>
                                <li className="hover:text-foreground cursor-pointer transition-colors">Películas</li>
                                <li className="hover:text-foreground cursor-pointer transition-colors">Mi Lista</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-foreground font-semibold mb-4">Ayuda</h3>
                            <ul className="space-y-2 text-muted-foreground text-sm">
                                <li className="hover:text-foreground cursor-pointer transition-colors">FAQ</li>
                                <li className="hover:text-foreground cursor-pointer transition-colors">Contacto</li>
                                <li className="hover:text-foreground cursor-pointer transition-colors">Soporte</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-foreground font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2 text-muted-foreground text-sm">
                                <li className="hover:text-foreground cursor-pointer transition-colors">Privacidad</li>
                                <li className="hover:text-foreground cursor-pointer transition-colors">Términos</li>
                                <li className="hover:text-foreground cursor-pointer transition-colors">Cookies</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
                        <p>© 2024 CineMax. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>

            {/* Styles moved to index.css for global scope, but keeping local ones if needed */}
            <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
}
