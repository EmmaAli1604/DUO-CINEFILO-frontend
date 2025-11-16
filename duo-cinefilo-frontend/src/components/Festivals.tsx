import { ArrowLeft, Calendar, MapPin, Film } from 'lucide-react';
import type { User } from '../App';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

type Festival = {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  price: number;
  imageUrl: string;
  films: number;
};

const MOCK_FESTIVALS: Festival[] = [
  {
    id: '1',
    title: 'Festival Internacional de Cine Independiente',
    description: 'Una celebración del cine independiente de todo el mundo con proyecciones, talleres y conferencias.',
    location: 'Centro de Convenciones',
    startDate: '2025-12-10',
    endDate: '2025-12-15',
    price: 25.00,
    imageUrl: 'https://images.unsplash.com/photo-1527979809431-ea3d5c0c01c9?w=800',
    films: 45
  },
  {
    id: '2',
    title: 'Muestra de Cortometrajes Latinoamericanos',
    description: 'Descubre los mejores cortometrajes de la región con la presencia de directores y actores.',
    location: 'Teatro Nacional',
    startDate: '2025-11-28',
    endDate: '2025-11-30',
    price: 15.00,
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
    films: 30
  },
  {
    id: '3',
    title: 'Festival de Cine Documental',
    description: 'Explora historias reales contadas a través del lente de documentalistas talentosos.',
    location: 'Museo de Arte Contemporáneo',
    startDate: '2026-01-15',
    endDate: '2026-01-20',
    price: 20.00,
    imageUrl: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=800',
    films: 35
  }
];

type FestivalsProps = {
  user: User | null;
  onBack: () => void;
};

export function Festivals({ user, onBack }: FestivalsProps) {
  const handleBuyPass = (festival: Festival) => {
    if (!user) {
      alert('Debes iniciar sesión para comprar un pase');
      return;
    }
    alert(`Has comprado un pase para: ${festival.title}`);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-white hover:bg-white/10 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver
        </Button>

        <div className="mb-8">
          <h1 className="text-white text-4xl mb-4">Festivales de Cine</h1>
          <p className="text-white/60 text-lg">
            Experiencias cinematográficas únicas e inolvidables
          </p>
        </div>

        <div className="space-y-6">
          {MOCK_FESTIVALS.map((festival) => (
            <div
              key={festival.id}
              className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors"
            >
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 aspect-video md:aspect-auto">
                  <ImageWithFallback
                    src={festival.imageUrl}
                    alt={festival.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-2 p-6">
                  <h2 className="text-white text-2xl mb-3">{festival.title}</h2>
                  <p className="text-white/70 mb-4">{festival.description}</p>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-white/60">
                      <MapPin className="w-5 h-5 text-red-600" />
                      <span>{festival.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <Calendar className="w-5 h-5 text-red-600" />
                      <span>
                        {festival.startDate} - {festival.endDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <Film className="w-5 h-5 text-red-600" />
                      <span>{festival.films} películas</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-white/60 text-sm block">Pase completo</span>
                      <span className="text-white text-2xl">${festival.price}</span>
                    </div>
                    <Button
                      onClick={() => handleBuyPass(festival)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Comprar Pase
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
