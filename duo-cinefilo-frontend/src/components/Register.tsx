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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        onRegister(name, email, password);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className='flex items-center gap-2 text-foreground'>
                            <img src={logo} alt="Logo" className="h-10 w-10" />
                            <span className="text-2xl font-semibold tracking-wider">DUO-CINEFILO</span>
                        </div>
                    </div>
                    <h1 className="text-foreground text-3xl font-bold mb-2 break-words">Crear Cuenta</h1>
                    <p className="text-muted-foreground text-sm">Únete a la mejor experiencia de cine</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-card border border-border/50 rounded-lg p-8 shadow-2xl">
                    
                    <div className="flex justify-center mb-6 border-b border-border/50">
                        <button
                            type="button"
                            onClick={() => onNavigate('login')}
                            className="pb-3 px-6 text-muted-foreground hover:text-foreground/80 transition-colors"
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            type="button"
                            className="pb-3 px-6 text-primary border-b-2 border-primary font-semibold"
                        >
                            Registrarse
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="name" className="text-foreground mb-1 block">
                                Nombre Completo
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="bg-secondary border-border/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-offset-background"
                                placeholder="Juan Pérez"
                            />
                        </div>

                        <div>
                            <Label htmlFor="email" className="text-foreground mb-1 block">
                                Correo Electrónico
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-secondary border-border/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-offset-background"
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password" className="text-foreground mb-1 block">
                                Contraseña
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-secondary border-border/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-offset-background"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword" className="text-foreground mb-1 block">
                                Confirmar Contraseña
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="bg-secondary border-border/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-offset-background"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="mt-8">
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-cinema-glow text-primary-foreground font-semibold py-3"
                        >
                            Crear Cuenta
                        </Button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        ¿Ya tienes cuenta?{' '}
                        <button
                            onClick={() => onNavigate('login')}
                            className="text-primary hover:text-cinema-glow font-semibold"
                        >
                            Inicia sesión
                        </button>
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
