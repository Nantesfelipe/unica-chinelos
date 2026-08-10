import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  LogOut,
} from 'lucide-react';

import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import logo from "../../assets/images/logo/Logo3.png";
function Header() {
  const navigate = useNavigate();
  const { usuario, autenticado, logout } = useAuth();
  const { quantidadeItens } = useCart();

  const [busca, setBusca] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);

  function handleBusca(event) {
    event.preventDefault();

    const termo = busca.trim();

    if (!termo) {
      navigate('/produtos');
      return;
    }

    navigate(`/produtos?busca=${encodeURIComponent(termo)}`);
    setMenuAberto(false);
  }

  function handleLogout() {
    logout();
    setMenuAberto(false);
    navigate('/');
  }

  return (
    <header className="bg-[#171511] text-[#e2dacc] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Única Conceitos"
              className="h-20 w-20 rounded-full object-cover shadow-md"
            />
          </Link>

          {/* Pesquisa desktop */}
          <form
            onSubmit={handleBusca}
            className="hidden md:flex flex-1 max-w-xl"
          >
            <div className="w-full flex items-center gap-3 bg-white/5 border border-[#746c5c]/30 rounded-md px-4 py-2.5">
              <Search
                size={18}
                className="text-[#8e8980] flex-shrink-0"
              />

              <input
                type="text"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Buscar por nome ou cor"
                className="bg-transparent text-[#e2dacc] placeholder-[#8e8980] text-sm outline-none w-full"
              />
            </div>
          </form>

          {/* Navegação desktop */}
          <nav className="hidden md:flex items-center gap-5">
            <Link
              to="/produtos"
              className="text-sm hover:text-[#8e8980] transition-colors"
            >
              Produtos
            </Link>

            <Link
              to="/carrinho"
              title="Carrinho"
              className="relative hover:text-[#8e8980] transition-colors"
            >
              <ShoppingCart size={20} />

              {quantidadeItens > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#746c5c] text-[#e2dacc] text-[10px] min-w-4 h-4 rounded-full flex items-center justify-center">
                  {quantidadeItens}
                </span>
              )}
            </Link>

            {autenticado && (
              <Link
                to="/pedidos"
                title="Meus pedidos"
                className="hover:text-[#8e8980] transition-colors"
              >
                <Heart size={20} />
              </Link>
            )}

            <Link
              to={autenticado ? '/perfil' : '/login'}
              title={autenticado ? 'Minha conta' : 'Entrar'}
              className="hover:text-[#8e8980] transition-colors"
            >
              <User size={20} />
            </Link>
          </nav>

          {/* Botão mobile */}
          <button
            type="button"
            onClick={() => setMenuAberto((estado) => !estado)}
            className="md:hidden text-[#e2dacc]"
            aria-label="Abrir menu"
          >
            {menuAberto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Pesquisa mobile */}
        <form
          onSubmit={handleBusca}
          className="md:hidden mt-4"
        >
          <div className="flex items-center gap-3 bg-white/5 border border-[#746c5c]/30 rounded-md px-4 py-2.5">
            <Search
              size={18}
              className="text-[#8e8980] flex-shrink-0"
            />

            <input
              type="text"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar por nome ou cor"
              className="bg-transparent text-[#e2dacc] placeholder-[#8e8980] text-sm outline-none w-full"
            />
          </div>
        </form>

        {/* Menu mobile */}
        {menuAberto && (
          <nav className="md:hidden border-t border-[#746c5c]/30 mt-4 pt-4 pb-2 space-y-3">
            <Link
              to="/produtos"
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-3 text-sm"
            >
              Produtos
            </Link>

            <Link
              to="/carrinho"
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-3 text-sm"
            >
              <ShoppingCart size={18} />
              Carrinho ({quantidadeItens})
            </Link>

            <Link
              to="/perfil"
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-3 text-sm"
            >
              <User size={18} />
              {autenticado ? 'Meu perfil' : 'Entrar'}
            </Link>

            {autenticado && (
              <>
                <Link
                  to="/pedidos"
                  onClick={() => setMenuAberto(false)}
                  className="flex items-center gap-3 text-sm"
                >
                  Meus pedidos
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-sm text-left"
                >
                  <LogOut size={18} />
                  Sair
                </button>

                <p className="text-xs text-[#8e8980] pt-1">
                  Olá, {usuario?.nome}
                </p>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;