import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import logo from '../assets/logo.png';

type RegisterProps = {
    onRegister: (name: string, email: string, password: string) => void;
    onNavigate: (page: 'home' | 'login') => void;
};

export function Register({ onRegister, onNavigate }: RegisterProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        if (!acceptedPrivacy || !acceptedTerms) {
            alert('Debes aceptar el Aviso de Privacidad y los Términos y Condiciones.');
            return;
        }

        onRegister(name, email, password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <img src={logo} alt="Logo" />
                    </div>
                    <h1 className="text-white text-2xl mb-2">Crear Cuenta</h1>
                    <p className="text-white/60">Únete a la mejor experiencia de cine</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-card border border-border/50 rounded-lg p-8 shadow-2xl">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name" className="text-white mb-2">
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
                            <Label htmlFor="email" className="text-white mb-2">
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
                            <Label htmlFor="password" className="text-white mb-2">
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
                            <Label htmlFor="confirmPassword" className="text-white mb-2">
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

                        {/* 🔹 Checkbox Aviso de Privacidad */}
                        <div className="flex items-start gap-3 mt-4">
                            <input
                                type="checkbox"
                                id="privacy"
                                checked={acceptedPrivacy}
                                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                                className="w-5 h-5"
                            />
                            <Label htmlFor="privacy" className="text-white text-sm cursor-pointer">
                                Acepto el <span className="underline">Aviso de Privacidad</span>.
                            </Label>
                        </div>

                        {/* 🔹 Checkbox Términos y Condiciones */}
                        <div className="flex items-start gap-3 mt-2">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                className="w-5 h-5"
                            />
                            <Label htmlFor="terms" className="text-white text-sm cursor-pointer">
                                Acepto los <span className="underline">Términos y Condiciones</span>.
                            </Label>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full text-white mt-6"
                    >
                        Crear Cuenta
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-white/60">
                        ¿Ya tienes cuenta?{' '}
                        <button
                            onClick={() => onNavigate('login')}
                            className="text-white/60 hover:text-white"
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
