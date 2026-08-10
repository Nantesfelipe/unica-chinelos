import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, LogOut, ShoppingBag, Heart, ImageOff } from 'lucide-react';

import useAuth from '../../hooks/useAuth';

import { listarFavoritos, removerFavorito } from '../../services/favorite.service';

import Button from '../../components/Button';
import Loading from '../../components/Loading';

import formatCurrency from '../../utils/formatCurrency';

function Perfil() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const [favoritos, setFavoritos] = useState([]);
  const [carregandoFavoritos, setCarregandoFavoritos] = useState(true);
  const [erroFavoritos, setErroFavoritos] = useState('');

  useEffect(() => {
    if (!usuario) return;

    listarFavoritos()
      .then((dados) => setFavoritos(Array.isArray(dados) ? dados : []))
      .catch((error) => setErroFavoritos(error.message))
      .finally(() => setCarregandoFavoritos(false));
  }, [usuario]);

  async function handleRemoverFavorito(produtoId) {
    try {
      await removerFavorito(produtoId);
      setFavoritos((atual) => atual.filter((item) => item.id !== produtoId));
    } catch (error) {
      setErroFavoritos(error.message);
    }
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  if (!usuario) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <User size={40} className="mx-auto text-[#8e8980]" />

        <h1 className="text-2xl font-semibold text-[#171511] mt-5">
          Você não está logado.
        </h1>

        <Link to="/login" className="inline-block mt-5 text-[#746c5c]">
          Fazer login
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <p className="text-sm text-[#74645c]">Minha conta</p>

      <h1 className="text-3xl font-semibold text-[#171511] mt-1 mb-8">
        Meu perfil
      </h1>

      <div className="bg-white rounded-lg p-6">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <User size={19} className="text-[#746c5c] mt-1" />
            <div>
              <p className="text-xs text-[#8e8980]">Nome</p>
              <p className="text-[#171511] mt-1">{usuario.nome}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Mail size={19} className="text-[#746c5c] mt-1" />
            <div>
              <p className="text-xs text-[#8e8980]">E-mail</p>
              <p className="text-[#171511] mt-1">{usuario.email}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-[#8e8980]">Tipo de conta</p>
            <p className="text-[#171511] mt-1 capitalize">{usuario.tipo}</p>
          </div>
        </div>

        <div className="border-t border-[#8e8980]/20 mt-8 pt-6 flex flex-col sm:flex-row gap-3">
          <Link
            to="/pedidos"
            className="flex items-center justify-center gap-2 border border-[#8e8980]/40 px-5 py-3 rounded-md text-sm text-[#171511] hover:border-[#746c5c]"
          >
            <ShoppingBag size={17} />
            Meus pedidos
          </Link>

          <Button onClick={handleLogout} className="sm:w-auto">
            <span className="inline-flex items-center justify-center gap-2">
              <LogOut size={17} />
              Sair
            </span>
          </Button>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center gap-2 mb-5">
          <Heart size={19} className="text-[#746c5c]" />
          <h2 className="text-xl font-semibold text-[#171511]">Meus favoritos</h2>
        </div>

        {carregandoFavoritos && <Loading text="Carregando favoritos..." />}

        {!carregandoFavoritos && erroFavoritos && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-5">
            <p className="text-sm text-red-700">{erroFavoritos}</p>
          </div>
        )}

        {!carregandoFavoritos && !erroFavoritos && favoritos.length === 0 && (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-[#8e8980] text-sm">
              Você ainda não favoritou nenhum produto.
            </p>
          </div>
        )}

        {!carregandoFavoritos && !erroFavoritos && favoritos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {favoritos.map((produto) => {
              const imagem =
                produto?.imagem ||
                produto?.imagem_url ||
                produto?.imagens?.[0]?.url;

              return (
                <div
                  key={produto.id}
                  className="bg-white border border-[#8e8980]/25 rounded-lg overflow-hidden"
                >
                  <Link to={`/produto/${produto.id}`} className="block">
                    <div className="h-32 bg-[#e2dacc] flex items-center justify-center">
                      {imagem ? (
                        <img
                          src={imagem}
                          alt={produto.nome}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageOff size={22} className="text-[#8e8980]" />
                      )}
                    </div>

                    <div className="p-3">
                      <p className="text-sm text-[#171511] line-clamp-2 min-h-10">
                        {produto.nome}
                      </p>
                      <p className="text-sm font-semibold text-[#171511] mt-1">
                        {formatCurrency(produto.preco)}
                      </p>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleRemoverFavorito(produto.id)}
                    className="w-full text-xs text-[#8e8980] hover:text-red-700 border-t border-[#8e8980]/20 py-2 transition-colors"
                  >
                    Remover dos favoritos
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Perfil;