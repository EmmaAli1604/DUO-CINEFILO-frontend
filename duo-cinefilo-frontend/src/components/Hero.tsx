import { Button } from "./ui/button";
import { Play, Ticket } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop"
          alt="Cinema"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-black via-cinema-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-transparent to-cinema-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-3xl space-y-6 animate-slide-up">
          <div className="inline-block px-4 py-2 bg-cinema-rose/20 border border-cinema-rose/30 rounded-full backdrop-blur-sm">
            <span className="text-cinema-rose font-semibold uppercase tracking-wider text-sm">
              Película Destacada
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-serif font-bold leading-tight">
            Descubre el Cine
            <span className="block text-cinema-rose">de Autor</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl leading-relaxed">
            Una experiencia cinematográfica única donde cada película cuenta una historia 
            extraordinaria. Desde clásicos del cine independiente hasta las últimas obras maestras.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/peliculas">
              <Button size="lg" className="text-lg px-8 py-6 bg-cinema-rose hover:bg-cinema-glow transition-all">
                <Play className="w-5 h-5 mr-2 fill-current" />
                Ver Películas
              </Button>
            </Link>
            <Link to="/cines">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Ticket className="w-5 h-5 mr-2" />
                Comprar Boletos
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
