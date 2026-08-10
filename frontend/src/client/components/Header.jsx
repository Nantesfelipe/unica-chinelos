import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User } from 'lucide-react';

function Header() {
  return (
    <header className="bg-[#171511] px-6 py-4 flex items-center justify-between gap-4">
      <Link to="/" className="text-[#e2dacc] font-semibold text-lg">
        Única Chinelos
      </Link>

      <div className="flex-1 max-w-xs flex items-center gap-2 bg-white/5 rounded-md px-3 py-2">
        <Search size={16} className="text-[#8e8980]" />
        <input
          type="text"
          placeholder="Buscar por nome ou cor"
          className="bg-transparent text-[#e2dacc] placeholder-[#8e8980] text-sm outline-none w-full"
        />
      </div>

      <nav className="flex items-center gap-5 text-[#e2dacc]">
        <Link to="/produtos" className="text-sm">Produtos</Link>
        <Link to="/carrinho"><ShoppingCart size={20} /></Link>
        <Link to="/perfil"><User size={20} /></Link>
      </nav>
    </header>
  );
}

export default Header;