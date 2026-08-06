import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-[#481346] px-6 py-4 flex items-center justify-between gap-4">
      <Link to="/" className="text-white font-semibold text-lg">
        Única Chinelos
      </Link>

      <div className="flex-1 max-w-xs">
        <input
          type="text"
          placeholder="Buscar por nome ou cor"
          className="w-full rounded-md bg-white/10 text-white placeholder-[#a47ea4] px-3 py-2 text-sm outline-none"
        />
      </div>

      <nav className="flex items-center gap-5 text-white text-sm">
        <Link to="/produtos">Produtos</Link>
        <Link to="/carrinho">Carrinho</Link>
        <Link to="/perfil">Perfil</Link>
      </nav>
    </header>
  );
}

export default Header;