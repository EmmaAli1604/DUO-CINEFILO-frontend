import {
  Search,
  User as UserIcon,
  LogOut,
  Film,
  Calendar,
  Briefcase,
} from 'lucide-react';
import { User } from '../App'; // Asegúrate de que esta ruta y tipo sean correctos
import { Button } from './ui/button';

type HeaderProps = {
  user: User | null;
  onNavigate: (page: 'home' | 'login' | 'profile' | 'workshops' | 'festivals') => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

export function Header({
  user,
  onNavigate,
  onLogout,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2">
              <Film className="w-8 h-8 text-red-600" />
              <span className="text-white text-2xl tracking-tight">CineMax</span>
            </button>

            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => onNavigate('home')}
                className="text-white/80 hover:text-white transition-colors"
              >
                Películas
              </button>
              <button
                onClick={() => onNavigate('workshops')}
                className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                Talleres
              </button>
              <button
                onClick={() => onNavigate('festivals')}
                className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Festivales
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                placeholder="Buscar películas..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-md pl-10 pr-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('profile')}
                  className="text-white hover:text-white hover:bg-white/10"
                >
                  <UserIcon className="w-4 h-4 mr-2" />
                  {user.name}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-white hover:text-white hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                onClick={() => onNavigate('login')}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Iniciar Sesión
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}