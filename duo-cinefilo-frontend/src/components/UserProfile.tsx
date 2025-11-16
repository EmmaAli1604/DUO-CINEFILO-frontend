import { ArrowLeft, Film, Ticket } from 'lucide-react';
import type { User } from '../App';
import { Button } from './ui/button';

type UserProfileProps = {
  user: User;
  onBack: () => void;
  onLogout: () => void;
};

const MOCK_PURCHASES = [
  {
    id: '1',
    type: 'digital',
    title: 'Inception',
    date: '2025-11-08',
    price: 5.99
  },
  {
    id: '2',
    type: 'ticket',
    title: 'The Dark Knight',
    date: '2025-11-10',
    cinema: 'CineMax Plaza Central',
    seats: 'F5, F6',
    price: 17.98
  }
];

export function UserProfile({ user, onBack, onLogout }: UserProfileProps) {
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

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 mb-8">
            <h1 className="text-white text-3xl mb-4">Mi Perfil</h1>
            <div className="space-y-2">
              <p className="text-white/80">
                <span className="text-white/60">Nombre:</span> {user.name}
              </p>
              <p className="text-white/80">
                <span className="text-white/60">Email:</span> {user.email}
              </p>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="mt-6 border-white/20 text-white hover:bg-white/10"
            >
              Cerrar Sesión
            </Button>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-8">
            <h2 className="text-white text-2xl mb-6">Historial de Compras</h2>
            <div className="space-y-4">
              {MOCK_PURCHASES.map((purchase) => (
                <div
                  key={purchase.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      {purchase.type === 'digital' ? (
                        <Film className="w-6 h-6 text-red-600 flex-shrink-0" />
                      ) : (
                        <Ticket className="w-6 h-6 text-red-600 flex-shrink-0" />
                      )}
                      <div>
                        <h3 className="text-white mb-2">{purchase.title}</h3>
                        <p className="text-white/60 text-sm mb-1">
                          {purchase.type === 'digital' ? 'Película Digital' : 'Boletos de Cine'}
                        </p>
                        {purchase.type === 'ticket' && (
                          <>
                            <p className="text-white/60 text-sm">
                              {purchase.cinema}
                            </p>
                            <p className="text-white/60 text-sm">
                              Asientos: {purchase.seats}
                            </p>
                          </>
                        )}
                        <p className="text-white/50 text-sm mt-2">{purchase.date}</p>
                      </div>
                    </div>
                    <span className="text-white">${purchase.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
