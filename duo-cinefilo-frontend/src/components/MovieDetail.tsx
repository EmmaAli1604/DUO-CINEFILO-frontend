import { useState } from 'react';
import { ArrowLeft, Star, Play, MapPin, ShoppingCart, Info } from 'lucide-react';
import type { Movie, Cinema } from '../App';
import type { User } from '../App';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';

const MOCK_CINEMAS: Cinema[] = [
    { id: '1', name: 'CineMax Plaza Central', address: 'Av. Principal 123', distance: '2.5 km' },
    { id: '2', name: 'CineMax Mall Norte', address: 'Boulevard Norte 456', distance: '5.2 km' },
    { id: '3', name: 'CineMax Centro', address: 'Calle Centro 789', distance: '3.8 km' }
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
    onBuyTickets: (cinema: Cinema) => void;
    onBuyMovie: () => void;
};

export function MovieDetail({ movie, user, onBack, onBuyTickets, onBuyMovie }: MovieDetailProps) {
    const [userRating, setUserRating] = useState(0);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);

    const handleSubmitComment = () => {
        if (!user || !comment || userRating === 0) return;

        const newComment: Comment = {
            id: Date.now().toString(),
            user: user.name,
            rating: userRating,
            text: comment,
            date: new Date().toISOString().split('T')[0]
        };

        setComments([newComment, ...comments]);
        setComment('');
        setUserRating(0);
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
                {/* Gradiente oscuro sobre la imagen */}
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

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Movie Info */}
                        <div>
                            {/* Etiqueta de Género */}
                            <span className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-cinema-rose border border-cinema-rose rounded-full">
                  {movie.genre.toUpperCase()}
              </span>

                            <h1 className="text-foreground text-4xl mb-4 font-playfair-display">{movie.title}</h1>

                            <div className="flex items-center gap-4 text-muted-foreground mb-4">
                                <span>{movie.year}</span>
                                <span>•</span>
                                <span>{movie.duration}</span>
                                <span>•</span>
                                {/* Director */}
                                <span className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-cinema-rose" />
                    Dir. {movie.director}
                </span>
                            </div>

                            <div className="flex items-center gap-2 mb-6">
                                <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
                                <span className="text-foreground text-xl">{movie.rating}</span>
                                <span className="text-muted-foreground">/ 5</span>
                            </div>

                            <h2 className="text-foreground text-2xl mb-4">Sinopsis</h2>
                            <p className="text-foreground/80 mb-6">{movie.description}</p>
                        </div>

                        {/* Actions */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Botón Comprar Película (Primary/Rose) */}
                            <Button
                                onClick={onBuyMovie}
                                className="bg-primary hover:bg-cinema-glow text-primary-foreground h-12 text-lg"
                            >
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                Comprar Película - ${movie.price}
                            </Button>
                            {/* Botón Ver Tráiler (Secondary/Outline) */}
                            <Button
                                variant="outline"
                                className="border-border/50 text-foreground hover:bg-card/50 h-12 text-lg"
                            >
                                <Play className="w-5 h-5 mr-2" />
                                Ver Tráiler
                            </Button>
                        </div>

                        {/* Rating Section */}
                        {user && (
                            <div className="bg-card border border-border rounded-lg p-6">
                                <h3 className="text-foreground text-xl mb-4">Tu Calificación</h3>
                                <div className="flex gap-2 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setUserRating(star)}
                                            className="transition-transform hover:scale-110"
                                            aria-label={`Calificar con ${star} estrellas`}
                                        >
                                            <Star
                                                className={`w-8 h-8 ${
                                                    star <= userRating
                                                        ? 'fill-yellow-500 text-yellow-500'
                                                        : 'text-muted-foreground/30'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <Textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Escribe tu comentario..."
                                    // Estilos para textarea
                                    className="bg-secondary border-border/50 text-foreground placeholder:text-muted-foreground mb-4"
                                    rows={4}
                                />
                                <Button
                                    onClick={handleSubmitComment}
                                    disabled={!comment || userRating === 0}
                                    // Botón de acción (Primary/Rose)
                                    className="bg-primary hover:bg-cinema-glow text-primary-foreground"
                                >
                                    Publicar Comentario
                                </Button>
                            </div>
                        )}

                        {/* Comments */}
                        <div>
                            <h3 className="text-foreground text-2xl mb-6">Comentarios</h3>
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="bg-card border border-border/50 rounded-lg p-6"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-foreground">{comment.user}</span>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                                <span className="text-foreground">{comment.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-foreground/80 mb-2">{comment.text}</p>
                                        <span className="text-muted-foreground text-sm">{comment.date}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Cinemas */}
                    <div className="lg:col-span-1">
                        <div className="bg-card border border-border/50 rounded-lg p-6 sticky top-24">
                            <h3 className="text-foreground text-xl mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-cinema-rose" />
                                Comprar Boletos
                            </h3>
                            <p className="text-muted-foreground text-sm mb-4">
                                Selecciona el cine más cercano
                            </p>
                            <div className="space-y-3">
                                {MOCK_CINEMAS.map((cinema) => (
                                    <button
                                        key={cinema.id}
                                        onClick={() => onBuyTickets(cinema)}
                                        className="w-full bg-secondary/50 hover:bg-secondary border border-border/50 rounded-lg p-4 text-left transition-colors"
                                    >
                                        <div className="text-foreground mb-1">{cinema.name}</div>
                                        <div className="text-muted-foreground text-sm mb-2">{cinema.address}</div>
                                        <div className="text-cinema-rose text-sm">{cinema.distance}</div>
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