import { useNavigate } from 'react-router-dom';

import {
  LogOut,
  Menu,
} from 'lucide-react';

import useAuth from '../../hooks/useAuth';

function Topbar({
  onAbrirMenu,
}) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#8e8980]/20">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">

        {/* Botão mobile */}
        <button
          type="button"
          onClick={onAbrirMenu}
          aria-label="Abrir menu"
          className="inline-flex items-center justify-center w-10 h-10 rounded-md text-[#746c5c] hover:bg-[#e2dacc] lg:hidden"
        >
          <Menu size={21} />
        </button>

        {/* Saudação */}
        <p className="min-w-0 flex-1 text-sm text-[#8e8980] truncate">
          Olá,{' '}
          <span className="text-[#171511] font-medium">
            {usuario?.nome}
          </span>
        </p>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-2 text-sm text-[#746c5c] hover:text-[#171511] transition-colors"
        >
          <LogOut size={16} />

          <span className="hidden sm:inline">
            Sair
          </span>
        </button>
      </div>
    </header>
  );
}

export default Topbar;