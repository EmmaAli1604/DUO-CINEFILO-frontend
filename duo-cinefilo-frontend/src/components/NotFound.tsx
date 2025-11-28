import { Film } from 'lucide-react';
import { Button } from './ui/button';

type NotFoundProps = {
  onNavigateHome: () => void;
};

const NotFound = ({ onNavigateHome }: NotFoundProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="text-center">
        <Film className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="mb-4 text-6xl font-bold text-foreground">404</h1>
        <p className="mb-8 text-xl text-muted-foreground">
          ¡Ups! La página que buscas no existe.
        </p>
        <Button
          onClick={onNavigateHome}
          className="bg-primary hover:bg-cinema-glow text-primary-foreground font-semibold py-3 px-6"
        >
          Volver al Inicio
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
