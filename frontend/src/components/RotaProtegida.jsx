import { Navigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import Loading from './Loading';

function RotaProtegida({ children, apenasAdmin = false }) {
  const { autenticado, ehAdmin, carregando } = useAuth();

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Verificando acesso..." />
      </div>
    );
  }

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  if (apenasAdmin && !ehAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RotaProtegida;