import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import logo from '../assets/logo.png';

type LoginProps = {
    onLogin: (email: string, password: string) => void;
    onNavigate: (page: 'home' | 'register') => void;
};

export function Login({ onLogin, onNavigate }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Llamar a onLogin aquí si usas el formulario
    };

    return (
        // Contenedor principal con fondo oscuro
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <img src={logo} alt="Logo" />
                        </div>
                        <h1 className="text-2xl mb-2 font-semibold tracking-wider">DUO-CINEFILO</h1>
                    </div>
                    <h1 className="text-foreground text-3xl font-bold mb-2">Iniciar Sesión</h1>
                </div>

                {/* Contenedor del formulario con fondo de tarjeta (Card) */}
                <form onSubmit={handleSubmit} className="bg-card border border-border/50 rounded-lg p-8 shadow-2xl">

                    {/* Tabs de navegación (Inicia Sesión / Registrarse) para el efecto visual */}
                    <div className="flex justify-center mb-6 border-b border-border/50">
                        <button
                            type="button"
                            className="pb-3 px-6 text-primary border-b-2 border-primary font-semibold"
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            type="button"
                            onClick={() => onNavigate('register')}
                            className="pb-3 px-6 text-muted-foreground hover:text-foreground/80 transition-colors"
                        >
                            Registrarse
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="email" className="text-foreground mb-2 block">
                                Correo Electrónico
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                // Estilos para input oscuro y bordes de la paleta Cineteca
                                className="bg-secondary border-border/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-offset-background"
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password" className="text-foreground mb-2 block">
                                Contraseña
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                // Estilos para input oscuro y bordes de la paleta Cineteca
                                className="bg-secondary border-border/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-offset-background"
                                placeholder="••••••••"
                            />
                        </div>

                    </div>
                    {/* Botón dentro del formulario */}
                    <div className="mt-8">
                        <Button
                            type="submit"
                            onClick={handleSubmit} // Llama a handleSubmit al hacer clic
                            // Botón principal con color primary (cinema-rose)
                            className="w-full bg-primary hover:bg-cinema-glow text-primary-foreground font-semibold py-3"
                        >
                            Iniciar Sesión
                        </Button>
                    </div>
                </form>


                <div className="mt-6 text-center">
                    {/* Texto legal y navegación */}
                    <p className="text-sm text-muted-foreground">
                        Al continuar, aceptas nuestros
                        <span className="text-primary hover:text-cinema-glow cursor-pointer ml-1">Términos de Servicio</span> y
                        <span className="text-primary hover:text-cinema-glow cursor-pointer ml-1">Política de Privacidad</span>
                    </p>
                    <button
                        onClick={() => onNavigate('home')}
                        className="mt-4 text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        </div>
    );
}