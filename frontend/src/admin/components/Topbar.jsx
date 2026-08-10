import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

import useAuth from '../../hooks/useAuth';

function Topbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="h-16 bg-white border-b border-[#8e8980]/20 px-6 flex items-center justify-between">
      <p className="text-sm text-[#8e8980]">
        Olá, <span className="text-[#171511] font-medium">{usuario?.nome}</span>
      </p>

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm text-[#746c5c] hover:text-[#171511] transition-colors"
      >
        <LogOut size={16} />
        Sair
      </button>
    </header>
  );
}

export default Topbar;