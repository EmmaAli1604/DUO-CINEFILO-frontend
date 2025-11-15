import { useState } from 'react';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Home } from './components/Home';

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

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'home'>('home');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (email: string, _password: string) => {
    setUser({ id: '1', name: email.split('@')[0], email });
    alert(`Bienvenido ${email}`);
    setCurrentPage('home');
  };

  const handleRegister = (name: string, email: string, _password: string) => {
    setUser({ id: '1', name, email });
    alert(`Cuenta creada para ${name}`);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    alert('Sesión cerrada');
  };

  const handleMovieSelect = (movie: Movie) => {
    if (!user) {
      alert('Por favor inicia sesión para ver los detalles de la película');
      setCurrentPage('login');
      return;
    }
    alert(`Película seleccionada: ${movie.title}`);
    console.log('Película:', movie);
  };

  return (
    <>
      {currentPage === 'home' && (
        <Home 
          user={user}
          onMovieSelect={handleMovieSelect}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
        />
      )}
      
      {currentPage === 'login' && (
        <Login onLogin={handleLogin} onNavigate={setCurrentPage} />
      )}
      
      {currentPage === 'register' && (
        <Register onRegister={handleRegister} onNavigate={setCurrentPage} />
      )}
    </>
  );
}

export default App;