import { useState, useEffect } from 'react';
import { MovieCarousel } from './MovieCarousel';
import type { Movie, User } from '../App';
import { Search, User as UserIcon, LogOut, Play, Info, TrendingUp, Sparkles } from 'lucide-react';
import logo from '../assets/logo.png';

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

const GENRES = ['Todos', 'Drama', 'Acción', 'Ciencia Ficción', 'Thriller', 'Romance', 'Musical'];

type HomeProps = {
    user: User | null;
    onMovieSelect: (movie: Movie) => void;
    onNavigate: (page: 'home' | 'login' | 'register') => void;
    onLogout: () => void;
};

export function Home({ user, onMovieSelect, onNavigate, onLogout }: HomeProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('Todos');
    const [featuredMovie, setFeaturedMovie] = useState(MOCK_MOVIES[0]);
    const [scrolled, setScrolled] = useState(false);

    // Cambiar película destacada cada 8 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * MOCK_MOVIES.length);
            setFeaturedMovie(MOCK_MOVIES[randomIndex]);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    // Detectar scroll para cambiar el header
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const filteredMovies = MOCK_MOVIES.filter((movie) => {
        const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = selectedGenre === 'Todos' || movie.genre === selectedGenre;
        return matchesSearch && matchesGenre;
    });

    const dramaMovies = MOCK_MOVIES.filter(m => m.genre === 'Drama');
    const sciFiMovies = MOCK_MOVIES.filter(m => m.genre === 'Ciencia Ficción');
    const actionMovies = MOCK_MOVIES.filter(m => m.genre === 'Acción');
    const topRatedMovies = [...MOCK_MOVIES].sort((a, b) => b.rating - a.rating).slice(0, 6);

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
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent text-foreground outline-none flex-1 placeholder:text-muted-foreground"
                            />
                        </div>

                        {/* Usuario */}
                        <div className="flex items-center gap-3">
                            {user ? (
                                <>
                                    <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
                                        <UserIcon className="w-5 h-5 text-foreground" />
                                        <span className="text-foreground font-medium">{user.name}</span>
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
                            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight animate-slide-up">
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
                                    onClick={() => onMovieSelect(featuredMovie)}
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

            {/* FILTROS DE GÉNERO */}
            <div className="sticky top-16 md:top-20 z-40 bg-gradient-to-b from-background via-background to-transparent py-6 backdrop-blur-sm">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {GENRES.map((genre) => (
                            <button
                                key={genre}
                                onClick={() => setSelectedGenre(genre)}
                                className={`px-6 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${
                                    selectedGenre === genre
                                        // Botón activo: usa primary (cinema-rose) y glow shadow
                                        ? 'bg-primary text-primary-foreground shadow-lg shadow-cinema-rose/30 scale-105'
                                        // Botón inactivo: usa secondary (dark burgundy) y border
                                        : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border'
                                }`}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* CARRUSELES DE PELÍCULAS */}
            <div className="space-y-12 py-8 pb-20">
                {selectedGenre === 'Todos' ? (
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

                        <MovieCarousel
                            movies={MOCK_MOVIES}
                            title="Populares"
                            onMovieSelect={onMovieSelect}
                        />

                        <MovieCarousel
                            movies={actionMovies}
                            title="Acción y Aventura"
                            onMovieSelect={onMovieSelect}
                        />

                        <MovieCarousel
                            movies={dramaMovies}
                            title="Dramas Aclamados"
                            onMovieSelect={onMovieSelect}
                        />

                        <MovieCarousel
                            movies={sciFiMovies}
                            title="Ciencia Ficción"
                            onMovieSelect={onMovieSelect}
                        />
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
                            <h3 className="text-foreground font-semibold mb-4">Sobre Nosotros</h3>
                            <ul className="space-y-2 text-muted-foreground text-sm">
                                <li className="hover:text-foreground cursor-pointer transition-colors">¿Quiénes somos?</li>
                                <li className="hover:text-foreground cursor-pointer transition-colors">Mision y Vision</li>
                                <li className="hover:text-foreground cursor-pointer transition-colors">Valores</li>
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
                        <p>© 2025 DUO-CINEFILO. Todos los derechos reservados.</p>
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