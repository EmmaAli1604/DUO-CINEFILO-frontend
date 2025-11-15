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
        onLogin(email, password);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
                <div>
                <img src={logo} alt="Logo" />
                </div>
            </div>
            <h1 className="text-white text-2xl mb-2">Iniciar Sesión</h1>
            <p className="text-white/60">Accede a tu cuenta para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-8">
            <div className="space-y-4">
                <div>
                <Label htmlFor="email" className="text-white">
                    Correo Electrónico
                </Label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="tu@email.com"
                />
                </div>

                <div style={{ marginTop: '20px' , marginBottom: '20px' }}>
                <Label htmlFor="password" className="text-white">
                    Contraseña
                </Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="••••••••"
                />
                </div>

            </div>
            </form>
            <div className="mt-50 text-center" style={{ marginTop: '20px' , marginBottom: '20px' }}>
                <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-8"
                >
                Iniciar Sesión
                </Button>
            </div>

            <div className="mt-6 text-center">
            <p className="text-white/60">
                ¿No tienes cuenta?{' '}
                <button
                onClick={() => onNavigate('register')}
                className="text-red-600 hover:text-red-500"
                >
                Regístrate
                </button>
            </p>
            <button
                onClick={() => onNavigate('home')}
                className="mt-4 text-white/60 hover:text-white"
            >
                Volver al inicio
            </button>
            </div>
        </div>
        </div>
    );
}