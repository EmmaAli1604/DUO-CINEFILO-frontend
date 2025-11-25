/**
 * App.tsx
 *
 * Punto central de la aplicación. Gestiona las pantallas principales
 * (inicio, login, registro) y mantiene el estado global del usuario.
 */
import { useState } from 'react';
import type { ComponentType } from 'react';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { MovieDetail } from './components/MovieDetail';
import { UserProfile } from './components/UserProfile';
import Chatbot from './components/Chatbot';
import { Workshops } from './components/Workshops';
import { Festivals } from './components/Festivals';

const ChatbotComponent = Chatbot as ComponentType<{ onBack?: () => void }>;

// Tipos compartidos
export type User = {
  id: string;
  name: string;
  email: string;
};

export type Movie = {
  id: string;
  title: string;
  director: string;
  description: string;
  genre: string;
  imageUrl: string;
  price: number;
  rating: number;
  year: number;
  duration: string;
};

export type Cinema = {
  id: string;
  name: string;
  address: string;
  distance: string;
};

// Define el tipo de página explícitamente
export type AppPage =
  | 'home'
  | 'login'
  | 'register'
  | 'movie'
  // | 'seats'
  | 'profile'
  | 'workshops'
  | 'festivals'
  | 'chatbot';

export default function App() {

  const [currentPage, setCurrentPage] = useState<AppPage>('home');
    /**
   * Estado principal del usuario autenticado.
   *
   * `user`: Contiene la información del usuario cuando está autenticado.
   * `setUser`: Permite actualizar el usuario tras login o logout.
   */
  const [user, setUser] = useState<User | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);

  const navigateTo = (page: AppPage) => {
    setCurrentPage(page);
  };
    /**
   * Maneja el inicio de sesión del usuario.
   *
   * @param email Correo electrónico ingresado.
   * @param password Contraseña ingresada (no validada en esta versión).
   */
  const handleLogin = (email: string, password: string) => {
    setUser({ id: '1', name: 'Usuario', email });
    navigateTo('home');
  };

    /**
   * Maneja el registro de un nuevo usuario.
   *
   * @param name Nombre capturado en el formulario.
   * @param email Correo electrónico capturado.
   * @param password Contraseña definida por el usuario.
   */
  const handleRegister = (name: string, email: string, password: string) => {
    setUser({ id: '1', name, email });
    navigateTo('home');
  };

    /**
   * Cierra la sesión del usuario y regresa a la pantalla de inicio.
   */
  const handleLogout = () => {
    setUser(null);
    navigateTo('home');
  };

    /**
   * Maneja la selección de una película desde la vista principal.
   * Al seleccionar, cambia a la vista de detalle de película.
   *
   * @param movie Película seleccionada por el usuario.
   */
  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    navigateTo('movie');
  };

    /**
   * Maneja el flujo de compra de boletos en un cine.
   * Si el usuario no está autenticado, lo redirige al login.
   *
   * @param cinema Cine seleccionado para la compra.
   */

  const handleBuyTickets = (cinema: Cinema) => {
    if (!user) {
      navigateTo('login');
      return;
    }
    setSelectedCinema(cinema);
    alert('Selección de asientos aún no implementada');
  };

    /**
   * Maneja la compra digital de una película.
   * Si el usuario no está autenticado, lo envía a login.
   */
  const handleBuyMovie = () => {
    if (!user) {
      navigateTo('login');
      return;
    }
    alert('Película comprada exitosamente');
  };

  return (
    <div className="min-h-screen bg-black">
      {currentPage === 'home' && (
        <Home
          user={user}
          onMovieSelect={handleMovieSelect}
          onNavigate={navigateTo}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'login' && (
        <Login
          onLogin={handleLogin}
          onNavigate={navigateTo}
        />
      )}
      {currentPage === 'register' && (
        <Register
          onRegister={handleRegister}
          onNavigate={navigateTo}
        />
      )}
      {currentPage === 'movie' && selectedMovie && (
        <MovieDetail
          movie={selectedMovie}
          user={user}
          onBack={() => navigateTo('home')}
          onBuyTickets={handleBuyTickets}
          onBuyMovie={handleBuyMovie}
        />
      )}
      {currentPage === 'profile' && user && (
        <UserProfile
          user={user}
          onBack={() => navigateTo('home')}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'workshops' && (
        <Workshops
          user={user}
          onBack={() => navigateTo('home')}
        />
      )}
      {currentPage === 'festivals' && (
        <Festivals
          user={user}
          onBack={() => navigateTo('home')}
        />
      )}
      {currentPage === 'chatbot' && (
        <ChatbotComponent
          onBack={() => navigateTo('home')}
        />
      )}
    </div>
  );
}