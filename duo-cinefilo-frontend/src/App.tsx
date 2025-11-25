import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { MovieDetail } from './components/MovieDetail';
import Chatbot  from './components/Chatbot'; // <-- ¡IMPORTACIÓN CLAVE!

// Definiciones de tipos (asumiendo que estaban en App.tsx)
export type Page = 'home' | 'login' | 'register' | 'movieDetail';
export type User = { id: string; name: string; email: string };
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
    horarios: string[];
};


function App() {
    const [page, setPage] = useState<Page>('home');
    const [user, setUser] = useState<User | null>(null);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    // MOCK DATA
    const MOCK_USER: User = { id: 'user1', name: 'Duo Cinefilo', email: 'user@example.com' };

    // Funciones de navegación
    const handleNavigate = (newPage: 'home' | 'login' | 'register') => {
        setPage(newPage);
        setSelectedMovie(null);
    };

    // Funciones de autenticación
    const handleLogin = (email: string, password: string) => {
        // Lógica de login simple. En una app real, esto llamaría a una API.
        if (email === MOCK_USER.email && password === '123456') {
            setUser(MOCK_USER);
            setPage('home');
        } else {
            alert('Credenciales incorrectas');
        }
    };

    const handleRegister = (name: string, email: string, password: string) => {
        // Lógica de registro simple. En una app real, esto llamaría a una API.
        setUser({ id: 'newUser', name, email });
        setPage('home');
    }

    const handleLogout = () => {
        setUser(null);
        setPage('login');
    };

    // Funciones de película
    const handleMovieSelect = (movie: Movie) => {
        setSelectedMovie(movie);
        setPage('movieDetail');
    };

    const handleBack = () => {
        setSelectedMovie(null);
        setPage('home');
    };

    // Función de compra de boletos (mock)
    const handleWatchTrailer = () => {
        alert(`Ver trailer de ${selectedMovie?.title} `);
    };

    // Lógica para determinar si el Chatbot debe estar visible
    const isChatbotVisible = page !== 'login' && page !== 'register';

    // Renderizado condicional de la página
    const renderPage = () => {
        switch (page) {
            case 'home':
                return (
                    <Home
                        user={user}
                        onMovieSelect={handleMovieSelect}
                        onNavigate={handleNavigate}
                        onLogout={handleLogout}
                    />
                );
            case 'login':
                return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
            case 'register':
                return <Register onNavigate={handleNavigate} onRegister={handleRegister}/>;
            case 'movieDetail':
                if (selectedMovie) {
                    return (
                        <MovieDetail
                            movie={selectedMovie}
                            user={user}
                            onBack={handleBack}
                            onWatchTrailer={handleWatchTrailer}
                        />
                    );
                }
                // Fallback si no hay película seleccionada
                return <Home user={user} onMovieSelect={handleMovieSelect} onNavigate={handleNavigate} onLogout={handleLogout} />;
            default:
                // Podrías tener un componente NotFound aquí
                return <div>Página no encontrada</div>;
        }
    };

    return (
        <div className="relative min-h-screen">
            {/* Contenido de la página */}
            {renderPage()}

            {/* EL CHATBOT FLOTANTE SE RENDERIZA AQUÍ, FUERA DEL RENDERIZADO DE PÁGINAS */}
            {isChatbotVisible && <Chatbot />}
        </div>
    );
}

export default App;