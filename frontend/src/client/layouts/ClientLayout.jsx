import { useEffect } from 'react';
import {
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';

import useAuth from '../../hooks/useAuth';

function ClientLayout() {
  const {
    usuario,
    autenticado,
    carregando,
  } = useAuth();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  useEffect(() => {
    if (
      carregando ||
      !autenticado ||
      !usuario
    ) {
      return;
    }

    const camposObrigatorios = [
      'nome',
      'telefone',
      'cpf',
      'cep',
      'logradouro',
      'numero',
      'bairro',
      'cidade',
      'estado',
    ];

    const perfilCompleto =
      camposObrigatorios.every(
        (campo) => {
          const valor =
            usuario[campo];

          return (
            valor !== null &&
            valor !== undefined &&
            String(valor).trim() !== ''
          );
        }
      );

    if (perfilCompleto) {
      return;
    }

    if (
      location.pathname ===
      '/perfil'
    ) {
      return;
    }

    const chaveAviso =
      `perfil-incompleto-${usuario.id}`;

    const avisoJaExibido =
      sessionStorage.getItem(
        chaveAviso
      );

    if (!avisoJaExibido) {
      sessionStorage.setItem(
        chaveAviso,
        'true'
      );

      navigate('/perfil', {
        replace: true,
      });
    }
  }, [
    usuario,
    autenticado,
    carregando,
    location.pathname,
    navigate,
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#e2dacc]">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default ClientLayout;