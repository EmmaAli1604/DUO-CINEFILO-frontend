import { useParams, Link } from "react-router-dom";
import { Star, Clock, Calendar, Play, Ticket, MessageSquare } from "lucide-react";
import { Button } from "../components/ui/button";
import Navbar from "../components/Header";
import Chatbot from "../components/Chatbot";
import { mockMovies } from "../data/mockMovies";

const MovieDetail = () => {
  const { id } = useParams();
  const movie = mockMovies.find((m) => m.id === id);

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Película no encontrada</h1>
          <Link to="/">
            <Button>Volver al inicio</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-end pt-20">
        <div className="absolute inset-0">
          <img
            src={movie.image}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pb-12">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="px-4 py-2 bg-cinema-rose/20 border border-cinema-rose/30 rounded-full text-cinema-rose font-semibold uppercase tracking-wide text-sm">
                {movie.genre}
              </span>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-cinema-rose text-cinema-rose" />
                <span className="text-2xl font-bold">{movie.rating}</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif font-bold">{movie.title}</h1>
            
            <div className="flex items-center gap-6 text-foreground/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{movie.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{movie.duration} min</span>
              </div>
              <span>Dir. {movie.director}</span>
            </div>

            <div className="flex gap-4 pt-4">
              <Button size="lg" className="bg-cinema-rose hover:bg-cinema-glow">
                <Play className="w-5 h-5 mr-2 fill-current" />
                Ver Ahora
              </Button>
              <Button size="lg" variant="secondary">
                <Ticket className="w-5 h-5 mr-2" />
                Comprar Boletos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Synopsis */}
              <div>
                <h2 className="text-3xl font-serif font-bold mb-4">Sinopsis</h2>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  {movie.description}
                </p>
              </div>

              {/* Cast */}
              <div>
                <h2 className="text-3xl font-serif font-bold mb-4">Reparto</h2>
                <div className="flex flex-wrap gap-3">
                  {movie.cast.map((actor, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-secondary rounded-full text-sm"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Comments Section */}
              <div>
                <h2 className="text-3xl font-serif font-bold mb-4">Comentarios</h2>
                <div className="space-y-4">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <textarea
                      placeholder="Escribe tu comentario..."
                      className="min-h-24 bg-secondary border-border w-full p-2 rounded resize-none"
                      aria-label="Escribe tu comentario"
                    />
                    <Button className="mt-3 bg-cinema-rose hover:bg-cinema-glow">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Publicar Comentario
                    </Button>

                    {/* Mock Comments */}
                    <div className="bg-card border border-border rounded-lg p-4 space-y-3 mt-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cinema-rose flex items-center justify-center font-bold">
                          JD
                        </div>
                        <div>
                          <p className="font-semibold">Juan Pérez</p>
                          <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                        </div>
                      </div>
                      <p className="text-foreground/80">
                        Una obra maestra del cine. La dirección es impecable y las actuaciones son sobresalientes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-serif font-bold">Tu Calificación</h3>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} className="hover:scale-110 transition-transform">
                      <Star className="w-8 h-8 fill-cinema-rose/30 text-cinema-rose hover:fill-cinema-rose" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-serif font-bold">Información</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Director:</span>
                    <p className="font-semibold">{movie.director}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Año:</span>
                    <p className="font-semibold">{movie.year}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duración:</span>
                    <p className="font-semibold">{movie.duration} minutos</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Género:</span>
                    <p className="font-semibold">{movie.genre}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Chatbot />
    </div>
  );
};

export default MovieDetail;
