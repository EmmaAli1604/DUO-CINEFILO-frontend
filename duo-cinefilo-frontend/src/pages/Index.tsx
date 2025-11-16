import Header  from "../components/Header";
import Hero from "../components/Hero";
import MovieCarousel from "../components/MovieCarousel";
import Chatbot from "../components/Chatbot";
import { mockMovies } from "../data/mockMovies";

const Index = () => {
  const featuredMovies = mockMovies.slice(0, 5);
  const dramaMovies = mockMovies.filter(m => m.genre === "Drama" || m.genre === "Romance");
  const thrillerMovies = mockMovies.filter(m => m.genre === "Thriller" || m.genre === "Crime");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      <div className="space-y-12 pb-20">
        <MovieCarousel title="Películas Destacadas" movies={featuredMovies} />
        <MovieCarousel title="Drama y Romance" movies={dramaMovies} />
        <MovieCarousel title="Thriller y Suspenso" movies={thrillerMovies} />
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-cinema-burgundy to-cinema-black">
          <div className="container mx-auto px-4 text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-serif font-bold">
              Vive la Experiencia Completa
            </h2>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              Visita nuestros cines, disfruta de nuestra cafetería artesanal y participa en talleres exclusivos
            </p>
          </div>
        </section>
      </div>

      <Chatbot />
    </div>
  );
};

export default Index;
