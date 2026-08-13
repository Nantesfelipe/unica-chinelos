import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  LogOut,
  MessageCircle,
} from 'lucide-react';

import { FaInstagram } from 'react-icons/fa';

import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';

import { listarTiposComProdutos } from '../../services/productType.service';

import logo from '../../assets/images/logo/Logo3.png';

function Header() {
  const navigate = useNavigate();

  const { usuario, autenticado, logout } = useAuth();
  const { quantidadeItens } = useCart();

  const [busca, setBusca] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);
  const [tiposProduto, setTiposProduto] = useState([]);

  useEffect(() => {
    async function carregarTiposProduto() {
      try {
        const dados = await listarTiposComProdutos();

        setTiposProduto(
          Array.isArray(dados) ? dados : []
        );
      } catch (error) {
        console.error(
          'Erro ao carregar tipos de produto:',
          error
        );

        setTiposProduto([]);
      }
    }

    carregarTiposProduto();
  }, []);

  function handleBusca(event) {
    event.preventDefault();

    const termo = busca.trim();

    if (!termo) {
      navigate('/produtos');
      setMenuAberto(false);
      return;
    }

    navigate(
      `/produtos?busca=${encodeURIComponent(termo)}`
    );

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
          <Link
            to="/"
            className="flex items-center"
          >
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
                onChange={(event) =>
                  setBusca(event.target.value)
                }
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

            {/* Tipos de produto */}
            {tiposProduto.map((tipo) => (
              <Link
                key={tipo.id}
                to={`/produtos?tipoProdutoId=${tipo.id}`}
                className="text-sm hover:text-[#8e8980] transition-colors whitespace-nowrap"
              >
                {tipo.nome}
              </Link>
            ))}

            {/* Instagram */}
            <a
              href="https://www.instagram.com/unica__conceito?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              aria-label="Instagram"
              className="hover:text-[#8e8980] transition-colors"
            >
              <FaInstagram size={20} />
            </a>

            {/* Carrinho */}
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

            {/* Meus pedidos */}
            {autenticado && (
              <Link
                to="/pedidos"
                title="Meus pedidos"
                className="hover:text-[#8e8980] transition-colors"
              >
                <Heart size={20} />
              </Link>
            )}

            {/* Perfil */}
            <Link
              to={
                autenticado
                  ? '/perfil'
                  : '/login'
              }
              title={
                autenticado
                  ? 'Minha conta'
                  : 'Entrar'
              }
              className="hover:text-[#8e8980] transition-colors"
            >
              <User size={20} />
            </Link>
          </nav>

          {/* Botão mobile */}
          <button
            type="button"
            onClick={() =>
              setMenuAberto(
                (estado) => !estado
              )
            }
            className="md:hidden text-[#e2dacc]"
            aria-label="Abrir menu"
          >
            {menuAberto ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
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
              onChange={(event) =>
                setBusca(event.target.value)
              }
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
              onClick={() =>
                setMenuAberto(false)
              }
              className="flex items-center gap-3 text-sm"
            >
              Produtos
            </Link>

            {/* Tipos de produto */}
            {tiposProduto.map((tipo) => (
              <Link
                key={tipo.id}
                to={`/produtos?tipoProdutoId=${tipo.id}`}
                onClick={() =>
                  setMenuAberto(false)
                }
                className="flex items-center gap-3 text-sm"
              >
                {tipo.nome}
              </Link>
            ))}

            {/* Instagram */}
            <a
              href="https://www.instagram.com/unica__conceito?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                setMenuAberto(false)
              }
              className="flex items-center gap-3 text-sm"
            >
              <FaInstagram size={18} />
              Instagram
            </a>

            {/* Carrinho */}
            <Link
              to="/carrinho"
              onClick={() =>
                setMenuAberto(false)
              }
              className="flex items-center gap-3 text-sm"
            >
              <ShoppingCart size={18} />
              Carrinho ({quantidadeItens})
            </Link>

            {/* Perfil */}
            <Link
              to="/perfil"
              onClick={() =>
                setMenuAberto(false)
              }
              className="flex items-center gap-3 text-sm"
            >
              <User size={18} />

              {autenticado
                ? 'Meu perfil'
                : 'Entrar'}
            </Link>

            {/* Usuário autenticado */}
            {autenticado && (
              <>
                <Link
                  to="/pedidos"
                  onClick={() =>
                    setMenuAberto(false)
                  }
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

      {/* WhatsApp fixo */}
      <a
        href="https://wa.me/5567992239122"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco pelo WhatsApp"
        title="Fale conosco pelo WhatsApp"
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
      >
        <MessageCircle size={28} />
      </a>
    </header>
  );
}

export default Header;