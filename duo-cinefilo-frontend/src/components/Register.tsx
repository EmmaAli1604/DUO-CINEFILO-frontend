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
    onRegister: (userData: any) => void;
    onNavigate: (page: 'home' | 'login') => void;
};

/**
 * Renderiza el formulario de registro de usuario.
 *
 * El componente valida que las contraseñas coincidan, y si es así,
 * envía la información a la función `onRegister`.
 */

export function Register({ onRegister, onNavigate }: RegisterProps) {
    const [formData, setFormData] = useState({
        idusuario: '',
        password: '',
        confirmPassword: '',
        nombre: '',
        apellidopaterno: '',
        apellidomaterno: '',
        fechanacimiento: '',
        genero: '',
        email: ''
    });
    const [errors, setErrors] = useState<any>({});

    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const validate = () => {
        const newErrors: any = {};

        if (!formData.idusuario) newErrors.idusuario = 'El nombre de usuario es obligatorio.';
        if (!formData.nombre) newErrors.nombre = 'El nombre es obligatorio.';
        if (!formData.apellidopaterno) newErrors.apellidopaterno = 'El apellido paterno es obligatorio.';
        if (!formData.email) {
            newErrors.email = 'El correo electrónico es obligatorio.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El formato del correo electrónico no es válido.';
        }
        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria.';
        } else if (formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden.';
        }
        if (!formData.fechanacimiento) {
            newErrors.fechanacimiento = 'La fecha de nacimiento es obligatoria.';
        } else if (new Date(formData.fechanacimiento) > new Date()) {
            newErrors.fechanacimiento = 'La fecha de nacimiento no puede ser en el futuro.';
        }
        if (!formData.genero) newErrors.genero = 'El género es obligatorio.';

        if (!acceptedPrivacy) newErrors.acceptedPrivacy = 'Debes aceptar el aviso de privacidad.';
        if (!acceptedTerms) newErrors.acceptedTerms = 'Debes aceptar los términos y condiciones.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

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

        if (validate()) {
            const { confirmPassword, ...userData } = formData;
            onRegister(userData);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <img src={logo} alt="Logo" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-wider">DUO-CINEFILO</h1>

                    <h1 className="text-foreground text-3xl font-bold mb-2">Crear Cuenta</h1>
                    <p className="text-muted-foreground text-sm">
                        Únete a la mejor experiencia de cine
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-card border border-border/50 rounded-lg p-8 shadow-2xl">

                    {/* Tabs */}
                    <div className="flex justify-center mb-6 border-b border-border/50">
                        <button
                            type="button"
                            onClick={() => onNavigate('login')}
                            className="pb-3 px-6 text-muted-foreground hover:text-foreground/80"
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

                    <div className="space-y-4">

                        {/* Usuario */}
                        <div>
                            <Label htmlFor="idusuario" className="mb-2 block">Nombre de Usuario</Label>
                            <Input id="idusuario" value={formData.idusuario} onChange={handleChange} />
                            {errors.idusuario && <p className="text-red-500 text-xs mt-1">{errors.idusuario}</p>}
                        </div>

                        {/* Nombre */}
                        <div>
                            <Label htmlFor="nombre" className="mb-2 block">Nombre Completo</Label>
                            <Input id="nombre" value={formData.nombre} onChange={handleChange} />
                            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                        </div>

                        {/* Apellidos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="apellidopaterno" className="mb-2 block">Apellido Paterno</Label>
                                <Input id="apellidopaterno" value={formData.apellidopaterno} onChange={handleChange} />
                                {errors.apellidopaterno && (
                                    <p className="text-red-500 text-xs mt-1">{errors.apellidopaterno}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="apellidomaterno" className="mb-2 block">Apellido Materno</Label>
                                <Input id="apellidomaterno" value={formData.apellidomaterno} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="email" className="mb-2 block">Correo Electrónico</Label>
                            <Input id="email" type="email" value={formData.email} onChange={handleChange} />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Fecha y Género */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="fechanacimiento" className="mb-2 block">Fecha de Nacimiento</Label>
                                <Input
                                    id="fechanacimiento"
                                    type="date"
                                    value={formData.fechanacimiento}
                                    onChange={handleChange}
                                />
                                {errors.fechanacimiento && (
                                    <p className="text-red-500 text-xs mt-1">{errors.fechanacimiento}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="genero" className="mb-2 block">Género</Label>
                                <select
                                    id="genero"
                                    value={formData.genero}
                                    onChange={handleChange}
                                    className="w-full h-10 bg-secondary border border-border/50 rounded-md px-3 text-sm focus:ring-primary"
                                >
                                    <option value="" disabled>Selecciona tu género</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Femenino</option>
                                    <option value="O">Otro</option>
                                </select>
                                {errors.genero && <p className="text-red-500 text-xs mt-1">{errors.genero}</p>}
                            </div>
                        </div>

                        {/* Contraseña */}
                        <div>
                            <Label htmlFor="password" className="mb-2 block">Contraseña</Label>
                            <Input id="password" type="password" value={formData.password} onChange={handleChange} />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirmar contraseña */}
                        <div>
                            <Label htmlFor="confirmPassword" className="mb-2 block">Confirmar Contraseña</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* CHECKBOXES DE PRIVACIDAD Y TERMINOS */}
                        <div className="mt-4 space-y-3">

                            {/* Aviso de privacidad */}
                            <label className="flex items-start gap-3 text-sm">
                                <input
                                    type="checkbox"
                                    checked={acceptedPrivacy}
                                    onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                                    className="mt-1 h-4 w-4"
                                />
                                <span>
                                    Acepto el <span className="underline">Aviso de Privacidad</span>.
                                </span>
                            </label>
                            {errors.acceptedPrivacy && (
                                <p className="text-red-500 text-xs">{errors.acceptedPrivacy}</p>
                            )}

                            {/* Términos y condiciones */}
                            <label className="flex items-start gap-3 text-sm">
                                <input
                                    type="checkbox"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    className="mt-1 h-4 w-4"
                                />
                                <span>
                                    Acepto los <span className="underline">Términos y Condiciones</span>.
                                </span>
                            </label>
                            {errors.acceptedTerms && (
                                <p className="text-red-500 text-xs">{errors.acceptedTerms}</p>
                            )}
                        </div>
                    </div>

                    {/* BOTÓN */}
                    <div className="mt-8">
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-cinema-glow text-primary-foreground font-semibold py-3"
                        >
                            Crear Cuenta
                        </Button>
                    </div>
                </form>

                {/* FOOTER */}
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
