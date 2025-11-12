import { useState } from 'react';
import { Login } from './components/Login';
import { Register } from './components/Register';

export type User = {
  id: string;
  name: string;
  email: string;
};

function App() {
  // Solo se contemplan login y registro
  const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'home'>('login');
  const [user, setUser] = useState<User | null>(null);

  // Función de login simulada
  const handleLogin = (email: string, _password: string) => {
    setUser({ id: '1', name: 'Usuario', email });
    alert(`Bienvenido ${email}`);
    setCurrentPage('home');
  };

  // Función de registro simulada
  const handleRegister = (name: string, email: string, _password: string) => {
    setUser({ id: '1', name, email });
    alert(`Cuenta creada para ${name}`);
    setCurrentPage('login');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      {!user ? (
        <>
          {currentPage === 'login' && (
            <Login onLogin={handleLogin} onNavigate={setCurrentPage} />
          )}
          {currentPage === 'register' && (
            <Register onRegister={handleRegister} onNavigate={setCurrentPage} />
          )}
        </>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">¡Bienvenido, {user.name}!</h1>
          <p>Has iniciado sesión exitosamente.</p>
          <button
            className="mt-6 bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            onClick={() => {
              setUser(null);
              setCurrentPage('login');
            }}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
