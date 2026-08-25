import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';


import {
  buscarProdutoPorId,
  listarVariacoes,
  listarImagens,
} from '../../services/product.service';

import {
  listarFavoritos,
  adicionarFavorito,
  removerFavorito,
} from '../../services/favorite.service';

import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';

import GaleriaProduto from '../components/GaleriaProduto';
import BotaoFavorito from '../components/BotaoFavorito';

import Button from '../../components/Button';
import Loading from '../../components/Loading';

import formatCurrency from '../../utils/formatCurrency';
import AvaliacoesProduto from '../../components/AvaliacoesProduto';

function Produto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { adicionarAoCarrinho } = useCart();
  const { autenticado } = useAuth();

  const [produto, setProduto] = useState(null);
  const [variacoes, setVariacoes] = useState([]);
  const [imagens, setImagens] = useState([]);
  const [variacaoSelecionada, setVariacaoSelecionada] = useState(null);

  const [favoritado, setFavoritado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [erroCarrinho, setErroCarrinho] = useState('');
  const [adicionado, setAdicionado] = useState(false);

  useEffect(() => {
    async function carregarProduto() {
      setCarregando(true);
      setErro('');

      try {
        const [produtoData, variacoesData, imagensData] = await Promise.all([
          buscarProdutoPorId(id),
          listarVariacoes(id),
          listarImagens(id),
        ]);

        setProduto(produtoData);

        const variacoesArray = Array.isArray(variacoesData) ? variacoesData : [];
        setVariacoes(variacoesArray);
        setVariacaoSelecionada(
          variacoesArray.find((v) => v.estoque > 0) || variacoesArray[0] || null
        );

        setImagens(Array.isArray(imagensData) ? imagensData : []);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarProduto();
  }, [id]);

  useEffect(() => {
    if (!autenticado) {
      setFavoritado(false);
      return;
    }

    listarFavoritos()
      .then((favoritos) => {
        const lista = Array.isArray(favoritos) ? favoritos : [];
        setFavoritado(lista.some((item) => String(item.id) === String(id)));
      })
      .catch(() => setFavoritado(false));
  }, [autenticado, id]);

  async function handleToggleFavorito() {
    if (!autenticado) {
      navigate('/login');
      return;
    }

    try {
      if (favoritado) {
        await removerFavorito(id);
        setFavoritado(false);
      } else {
        await adicionarFavorito(id);
        setFavoritado(true);
      }
    } catch (error) {
      setErroCarrinho(error.message);
    }
  }

function adicionarProduto() {
  setErroCarrinho('');

  if (!variacaoSelecionada) {
    setErroCarrinho(
      'Selecione uma variação antes de adicionar ao carrinho.'
    );
    return;
  }

  if (variacaoSelecionada.estoque === 0) {
    setErroCarrinho(
      'Essa variação está sem estoque.'
    );
    return;
  }

  adicionarAoCarrinho(
    {
      ...produto,
      imagens,
    },
    variacaoSelecionada
  );

  setAdicionado(true);

  setTimeout(() => {
    setAdicionado(false);
  }, 2000);
}

  if (carregando) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <Loading text="Carregando produto..." />
      </section>
    );
  }

  if (erro || !produto) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-red-700">{erro || 'Produto não encontrado.'}</p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        <GaleriaProduto imagens={imagens} nome={produto.nome} />

        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[#74645c]">Produto</p>
              <h1 className="text-3xl font-semibold text-[#171511] mt-1">
                {produto.nome}
              </h1>
            </div>

            <BotaoFavorito favoritado={favoritado} onToggle={handleToggleFavorito} />
          </div>

          <p className="text-2xl font-semibold text-[#171511] mt-6">
            {formatCurrency(produto.preco)}
          </p>

          {produto.descricao && (
            <p className="text-[#746c5c] leading-relaxed mt-6">
              {produto.descricao}
            </p>
          )}

          {variacoes.length > 0 && (
            <div className="mt-8">
              <h2 className="font-medium text-[#171511] mb-3">Tamanho</h2>

              <div className="flex flex-wrap gap-2">
                {variacoes.map((variacao) => {
                  const selecionada =
                    variacaoSelecionada?.id === variacao.id;

                  const semEstoque =
                    Number(variacao.estoque) <= 0;

                  return (
                    <button
                      key={variacao.id}
                      type="button"
                      disabled={semEstoque}
                      onClick={() =>
                        setVariacaoSelecionada(variacao)
                      }
                      className={`
        border rounded-md px-5 py-3 text-sm transition-colors
        ${selecionada
                          ? 'border-[#746c5c] text-[#171511] bg-[#e2dacc]'
                          : 'border-[#8e8980]/40 text-[#171511] hover:border-[#746c5c]'
                        }
        ${semEstoque
                          ? 'opacity-40 cursor-not-allowed line-through'
                          : ''
                        }
      `}
                    >
                      <span className="font-medium">
                        {variacao.tamanho || `Variação ${variacao.id}`}
                      </span>

                      {variacao.cor && (
                        <span className="block text-xs text-[#8e8980] mt-1">
                          {variacao.cor}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-[#8e8980] mt-3">
                {variacaoSelecionada
                  ? variacaoSelecionada.estoque > 0
                    ? `${variacaoSelecionada.estoque} em estoque`
                    : 'Sem estoque para essa variação'
                  : 'Selecione uma variação'}
              </p>
            </div>
          )}

          {erroCarrinho && (
            <p className="text-sm text-red-700 mt-4">{erroCarrinho}</p>
          )}

          <div className="mt-8">
            <Button
              onClick={adicionarProduto}
              variant="primary"
              disabled={!variacaoSelecionada || variacaoSelecionada.estoque === 0}
            >
              {adicionado ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Check size={18} />
                  Adicionado ao carrinho
                </span>
              ) : (
                <span className="inline-flex items-center justify-center gap-2">
                  <ShoppingCart size={18} />
                  Adicionar ao carrinho
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
            <AvaliacoesProduto produtoId={id} />
    </section>
  );
}

export default Produto;