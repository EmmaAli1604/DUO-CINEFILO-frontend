/**
 * Componente Register.
 *
 * Pantalla para registrar un nuevo usuario. El componente recopila nombre,
 * correo y contraseña, valida que las contraseñas coincidan y llama a la
 * función de registro enviada desde App.
 *
 * Props:
 * - onRegister: Función que crea el nuevo usuario en la aplicación.
 * - onNavigate: Permite navegar entre login y home.
 */
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import logo from '../assets/logo.png';

type RegisterProps = {
    onRegister: (name: string, email: string, password: string) => void;
    onNavigate: (page: 'home' | 'login') => void;
};

/**
 * Renderiza el formulario de registro de usuario.
 *
 * El componente valida que las contraseñas coincidan, y si es así,
 * envía la información a la función `onRegister`.
 */

export function Register({ onRegister, onNavigate }: RegisterProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    /**
     * Valida los campos del formulario y ejecuta el registro.
     *
     * Args:
     *   e: Evento del formulario.
     *
     * Raises:
     *   Error visual mediante alert si las contraseñas no coinciden.
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
        }
        onRegister(name, email, password);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
                <img src={logo} alt="Logo" />
            </div>
            <h1 className="text-white text-2xl mb-2">Crear Cuenta</h1>
            <p className="text-white/60">Únete a la mejor experiencia de cine</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-8">
            <div className="space-y-4">
                <div>
                <Label htmlFor="name" className="text-white">
                    Nombre Completo
                </Label>
                <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="Juan Pérez"
                />
                </div>

                <div>
                <Label htmlFor="email" className="text-white" style={{ marginTop: '20px' }}>
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

                <div>
                <Label htmlFor="password" className="text-white" style={{ marginTop: '20px'}}>
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

                <div>
                <Label htmlFor="confirmPassword" className="text-white" style={{ marginTop: '20px' }}>
                    Confirmar Contraseña
                </Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                Crear Cuenta
                </Button>
            </div>

            <div className="mt-6 text-center">
            <p className="text-white/60">
                ¿Ya tienes cuenta?{' '}
                <button
                onClick={() => onNavigate('login')}
                className="text-red-600 hover:text-red-500"
                >
                Inicia sesión
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
