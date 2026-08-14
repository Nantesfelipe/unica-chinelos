import { useEffect, useState } from 'react';

import {
  Link,
} from 'react-router-dom';

import {
  Heart,
  ImageOff,
} from 'lucide-react';

import {
  listarFavoritos,
  removerFavorito,
} from '../../services/favorite.service';

import Loading from '../../components/Loading';

import formatCurrency from '../../utils/formatCurrency';

function ListaFavoritos() {
  const [
    favoritos,
    setFavoritos,
  ] = useState([]);

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  const [
    erro,
    setErro,
  ] = useState('');

  useEffect(() => {
    async function carregar() {
      try {
        const dados =
          await listarFavoritos();

        setFavoritos(
          Array.isArray(dados)
            ? dados
            : []
        );
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  async function handleRemover(
    produtoId
  ) {
    try {
      await removerFavorito(
        produtoId
      );

      setFavoritos(
        (atual) =>
          atual.filter(
            (produto) =>
              produto.id !==
              produtoId
          )
      );
    } catch (error) {
      setErro(error.message);
    }
  }

  return (
    <div className="mt-10">
      <div className="flex items-center gap-2 mb-5">
        <Heart
          size={19}
          className="text-[#746c5c]"
        />

        <h2 className="text-xl font-semibold text-[#171511]">
          Meus favoritos
        </h2>
      </div>

      {carregando && (
        <Loading text="Carregando favoritos..." />
      )}

      {!carregando &&
        erro && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-5">
            <p className="text-sm text-red-700">
              {erro}
            </p>
          </div>
        )}

      {!carregando &&
        !erro &&
        favoritos.length === 0 && (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-[#8e8980] text-sm">
              Você ainda não favoritou nenhum produto.
            </p>
          </div>
        )}

      {!carregando &&
        !erro &&
        favoritos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {favoritos.map(
              (produto) => {
                const imagem =
                  produto?.imagem ||
                  produto?.imagem_url ||
                  produto?.imagens?.[0]?.url;

                return (
                  <div
                    key={produto.id}
                    className="bg-white border border-[#8e8980]/25 rounded-lg overflow-hidden"
                  >
                    <Link
                      to={`/produto/${produto.id}`}
                      className="block"
                    >
                      <div className="h-32 bg-[#e2dacc] flex items-center justify-center">
                        {imagem ? (
                          <img
                            src={imagem}
                            alt={
                              produto.nome
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageOff
                            size={22}
                            className="text-[#8e8980]"
                          />
                        )}
                      </div>

                      <div className="p-3">
                        <p className="text-sm text-[#171511] line-clamp-2 min-h-10">
                          {
                            produto.nome
                          }
                        </p>

                        <p className="text-sm font-semibold text-[#171511] mt-1">
                          {formatCurrency(
                            produto.preco
                          )}
                        </p>
                      </div>
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemover(
                          produto.id
                        )
                      }
                      className="w-full text-xs text-[#8e8980] hover:text-red-700 border-t border-[#8e8980]/20 py-2 transition-colors"
                    >
                      Remover dos favoritos
                    </button>
                  </div>
                );
              }
            )}
          </div>
        )}
    </div>
  );
}

export default ListaFavoritos;