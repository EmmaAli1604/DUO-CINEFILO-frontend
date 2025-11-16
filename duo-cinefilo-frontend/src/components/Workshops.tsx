import { ArrowLeft, Calendar, Users, Clock } from 'lucide-react';
import type { User } from '../App';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

type Workshop = {
  id: string;
  title: string;
  instructor: string;
  description: string;
  date: string;
  duration: string;
  spots: number;
  price: number;
  imageUrl: string;
};

const MOCK_WORKSHOPS: Workshop[] = [
  {
    id: '1',
    title: 'Introducción a la Dirección Cinematográfica',
    instructor: 'Ana Martínez',
    description: 'Aprende los fundamentos de la dirección de cine con ejercicios prácticos.',
    date: '2025-11-20',
    duration: '3 horas',
    spots: 15,
    price: 45.00,
    imageUrl: 'https://images.unsplash.com/photo-1562939651-9359f291c988?w=500'
  },
  {
    id: '2',
    title: 'Guión y Narrativa Audiovisual',
    instructor: 'Roberto Sánchez',
    description: 'Técnicas para escribir guiones efectivos y contar historias visuales.',
    date: '2025-11-25',
    duration: '4 horas',
    spots: 20,
    price: 55.00,
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500'
  },
  {
    id: '3',
    title: 'Iluminación para Cine',
    instructor: 'Patricia López',
    description: 'Domina las técnicas de iluminación para crear atmósferas cinematográficas.',
    date: '2025-12-01',
    duration: '3.5 horas',
    spots: 12,
    price: 60.00,
    imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500'
  }
];

type WorkshopsProps = {
  user: User | null;
  onBack: () => void;
};

export function Workshops({ user, onBack }: WorkshopsProps) {
  const handleEnroll = (workshop: Workshop) => {
    if (!user) {
      alert('Debes iniciar sesión para inscribirte');
      return;
    }
    alert(`Te has inscrito en: ${workshop.title}`);
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
          <h1 className="text-white text-4xl mb-4">Talleres de Cine</h1>
          <p className="text-white/60 text-lg">
            Aprende de profesionales de la industria cinematográfica
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_WORKSHOPS.map((workshop) => (
            <div
              key={workshop.id}
              className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors"
            >
              <div className="aspect-video overflow-hidden">
                <ImageWithFallback
                  src={workshop.imageUrl}
                  alt={workshop.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-white text-xl mb-2">{workshop.title}</h3>
                <p className="text-red-600 mb-3">{workshop.instructor}</p>
                <p className="text-white/70 text-sm mb-4 line-clamp-2">
                  {workshop.description}
                </p>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-white/60">
                    <Calendar className="w-4 h-4" />
                    <span>{workshop.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <Clock className="w-4 h-4" />
                    <span>{workshop.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <Users className="w-4 h-4" />
                    <span>{workshop.spots} cupos disponibles</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-xl">${workshop.price}</span>
                  <Button
                    onClick={() => handleEnroll(workshop)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Inscribirse
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
