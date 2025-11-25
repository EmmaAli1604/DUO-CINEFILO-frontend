import { useState } from 'react';
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
  const [userRating, setUserRating] = useState(0);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);

  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    if (rating === 0) return;

    const newObj: Comment = {
      id: crypto.randomUUID(),
      user: "Usuario",
      text: newComment,
      rating: rating,
      date: new Date().toLocaleDateString(),
    };

    setComments((prev) => [...prev, newObj]);
    setNewComment("");
    setRating(0);
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
                <span className="text-foreground text-xl">{movie.rating}</span>
                <span className="text-muted-foreground">/ 5</span>
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

            {/* User Rating */}
            {user && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-foreground text-xl mb-4">Tu Calificación</h3>

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
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* COMMENTS SECTION */}
            <div>
              <h3 className="text-foreground text-2xl mb-6">Comentarios</h3>

              {/* Textarea + Rating */}
              <div className="mb-6 relative">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe tu comentario..."
                  className="w-full h-32 p-3 bg-card border border-border/50 rounded-lg text-foreground resize-none pr-20"
                />

                <div className="absolute bottom-2 right-3 flex gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      onClick={() => setRating(value)}
                      className={`w-5 h-5 cursor-pointer transition ${
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
                disabled={!newComment.trim() || rating === 0}
                className="bg-primary hover:bg-cinema-glow text-primary-foreground mb-5"
              >
                Publicar Comentario
              </Button>

              {/* Comments List */}
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
                ))}
              </div>
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
