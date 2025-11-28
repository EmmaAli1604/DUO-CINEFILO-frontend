/**
 * App.tsx
 *
 * Punto central de la aplicación. Gestiona las pantallas principales
 * (inicio, login, registro) y mantiene el estado global del usuario.
 */
import { useState } from 'react';
import type { ComponentType } from 'react';
import { Home } from './components/Home';
import { SearchResults } from './components/SearchResults';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { MovieDetail } from './components/MovieDetail';
import Chatbot from './components/Chatbot';
import NotFound from './components/NotFound';

// Definiciones de tipos (asumiendo que estaban en App.tsx)
export type Page = 'home' | 'login' | 'register' | 'movieDetail' | 'searchResults';
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
    // ID del video en YouTube (apéndice), opcional
    trailer?: string;
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
    const [currentSearchQuery, setCurrentSearchQuery] = useState<string>('');
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    // Utilidades simples para cookies de sesión
    const setSessionCookie = (name: string, value: string) => {
        // Cookie de sesión (sin expires) + atributos recomendados
        document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`;
    };

    const deleteCookie = (name: string) => {
        document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    };

    const getCookie = (name: string) => {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith(name + '='))
            ?.split('=')[1];
    };

    // Funciones de navegación
    const handleNavigate = (newPage: 'home' | 'login' | 'register') => {
        setPage(newPage);
        setSelectedMovie(null);
    };

    // Funciones de autenticación
    const handleLogin = async (email: string, password: string) => {
        try {
            const res = await fetch(`${apiBaseUrl}/users/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // El backend espera el correo como "idusuario" y la contraseña como "password"
                body: JSON.stringify({ idusuario: email, password }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Error de login (${res.status}): ${text}`);
            }

            const data = await res.json();
            // Flexibilidad con posibles nombres de campos
            const token: string = data.token || data.access_token || data.bearer || '';
            const username: string = data.username || data.user || data.name || '';

            if (!token || !username) {
                throw new Error('La respuesta del servidor no contiene token o username');
            }

            // Guardar en cookies de sesión
            setSessionCookie('authToken', `Bearer ${token}`);
            setSessionCookie('username', username);

            // Actualizar estado de usuario en la app
            setUser({ id: username, name: username, email });
            setPage('home');
        } catch (err: any) {
            console.error(err);
            alert('No se pudo iniciar sesión. Verifica tus credenciales.');
        }
    };

    const handleRegister = async (userData: any) => {
        try {
            const res = await fetch(`${apiBaseUrl}/users/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
    
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ detail: 'Error desconocido' }));
                throw new Error(errorData.detail || `Error de registro (${res.status})`);
            }
    
            // Si el registro es exitoso, redirigir a la página de login
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            setPage('login');
    
        } catch (err: any) {
            console.error(err);
            alert(`No se pudo completar el registro: ${err.message}`);
        }
    };

    const handleLogout = async () => {
        try {
            const usernameCookie = getCookie('username');
            const tokenCookie = getCookie('authToken');

            // Si faltan cookies, limpiamos y recargamos como fallback
            if (!usernameCookie || !tokenCookie) {
                deleteCookie('authToken');
                deleteCookie('username');
                setUser(null);
                window.location.reload();
                return;
            }

            const username = decodeURIComponent(usernameCookie);
            const authToken = decodeURIComponent(tokenCookie);

            const res = await fetch(`${apiBaseUrl}/users/logout/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken, // ya incluye el prefijo "Bearer " guardado en la cookie
                },
                body: JSON.stringify({ idusuario: username }),
            });

            if (res.status === 200) {
                // Al recibir 200, borrar cookies y recargar la página
                deleteCookie('authToken');
                deleteCookie('username');
                setUser(null);
                window.location.reload();
            } else {
                const text = await res.text();
                alert(`No se pudo cerrar sesión (${res.status}): ${text}`);
            }
        } catch (err) {
            console.error('Error al cerrar sesión:', err);
            alert('Ocurrió un error al cerrar sesión. Inténtalo nuevamente.');
        }
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

    // Iniciar búsqueda: guarda el query y navega a la vista de resultados
    const handleStartSearch = (query: string) => {
        setCurrentSearchQuery(query);
        setPage('searchResults');
    };

    // Función de compra de boletos (mock)
    const handleWatchTrailer = () => {
        if (selectedMovie?.trailer) {
            const url = `https://www.youtube.com/watch?v=${selectedMovie.trailer}`;
            // Abrir en nueva pestaña de forma segura
            const newWin = window.open(url, '_blank', 'noopener,noreferrer');
            if (newWin) newWin.opener = null;
        } else {
            alert('Este título no tiene trailer disponible');
        }
    };

    // Al montar la app, intentar restaurar sesión desde cookies
    useEffect(() => {
        const username = getCookie('username');
        const token = getCookie('authToken');
        // Restaurar solo si AMBAS cookies existen (token y usuario)
        if (username && token) {
            // Opcional: podríamos validar el token con el backend
            setUser({ id: username, name: username, email: '' });
        }
    }, []);

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
                        onStartSearch={handleStartSearch}
                        searchQuery={currentSearchQuery}
                        onSearchChange={setCurrentSearchQuery}
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
                return <Home user={user} onMovieSelect={handleMovieSelect} onNavigate={handleNavigate} onLogout={handleLogout} onStartSearch={handleStartSearch} searchQuery={currentSearchQuery} onSearchChange={setCurrentSearchQuery} />;
            case 'searchResults':
                return (
                    <SearchResults
                        query={currentSearchQuery}
                        onBackHome={() => setPage('home')}
                        onMovieSelect={handleMovieSelect}
                    />
                );
            default:
                return <NotFound onNavigateHome={() => handleNavigate('home')} />;
        }
    };

    return (
        <div className="relative min-h-screen">
            {/* Contenido de la página */}
            {renderPage()}

            {/* EL CHATBOT FLOTANTE SE RENDERIZA AQUÍ, FUERA DEL RENDERIZADO DE PÁGINAS */}
            {user && <Chatbot onSearch={setCurrentSearchQuery} onStartSearch={handleStartSearch} />}
        </div>
    );
}

export default App;
