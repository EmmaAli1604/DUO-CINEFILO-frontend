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
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <div className="relative h-[500px] overflow-hidden">
        <ImageWithFallback
          src={movie.imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <Button
          variant="ghost"
          onClick={onBack}
          className="absolute top-4 left-4 text-white hover:bg-white/10"
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
              <h1 className="text-white text-4xl mb-4">{movie.title}</h1>
              <div className="flex items-center gap-4 text-white/60 mb-4">
                <span>{movie.year}</span>
                <span>•</span>
                <span>{movie.duration}</span>
                <span>•</span>
                <span>{movie.genre}</span>
              </div>
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
                <span className="text-white text-xl">{movie.rating}</span>
                <span className="text-white/60">/ 5</span>
              </div>
              <p className="text-white/80 mb-2">
                <span className="text-white">Director:</span> {movie.director}
              </p>
              <p className="text-white/80">{movie.description}</p>
            </div>

            {/* Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                onClick={onBuyMovie}
                className="bg-red-600 hover:bg-red-700 text-white h-12"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Comprar Película - ${movie.price}
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 h-12"
              >
                <Play className="w-5 h-5 mr-2" />
                Ver Tráiler
              </Button>
            </div>

            {/* Rating Section */}
            {user && (
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="text-white text-xl mb-4">Califica esta película</h3>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setUserRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= userRating
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'text-white/30'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Escribe tu comentario..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 mb-4"
                  rows={4}
                />
                <Button
                  onClick={handleSubmitComment}
                  disabled={!comment || userRating === 0}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Publicar Comentario
                </Button>
              </div>
            )}

            {/* Comments */}
            <div>
              <h3 className="text-white text-2xl mb-6">Comentarios</h3>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-white/5 border border-white/10 rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white">{comment.user}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-white">{comment.rating}</span>
                      </div>
                    </div>
                    <p className="text-white/80 mb-2">{comment.text}</p>
                    <span className="text-white/50 text-sm">{comment.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Cinemas */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 sticky top-24">
              <h3 className="text-white text-xl mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                Comprar Boletos
              </h3>
              <p className="text-white/60 text-sm mb-4">
                Selecciona el cine más cercano
              </p>
              <div className="space-y-3">
                {MOCK_CINEMAS.map((cinema) => (
                  <button
                    key={cinema.id}
                    onClick={() => onBuyTickets(cinema)}
                    className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-4 text-left transition-colors"
                  >
                    <div className="text-white mb-1">{cinema.name}</div>
                    <div className="text-white/60 text-sm mb-2">{cinema.address}</div>
                    <div className="text-red-600 text-sm">{cinema.distance}</div>
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
