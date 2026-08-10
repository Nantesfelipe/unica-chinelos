import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ShoppingCart,
  Check,
} from 'lucide-react';

import {
  buscarProdutoPorId,
  listarVariacoes,
  listarImagens,
} from '../../services/product.service';

import useCart from '../../hooks/useCart';

import GaleriaProduto from '../components/GaleriaProduto';
import BotaoFavorito from '../components/BotaoFavorito';

import Button from '../../components/Button';
import Loading from '../../components/Loading';

import formatCurrency from '../../utils/formatCurrency';

function Produto() {
  const { id } = useParams();

  const { adicionarAoCarrinho } = useCart();

  const [produto, setProduto] = useState(null);
  const [variacoes, setVariacoes] = useState([]);
  const [imagens, setImagens] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [adicionado, setAdicionado] = useState(false);

  useEffect(() => {
    async function carregarProduto() {
      setCarregando(true);
      setErro('');

      try {
        const [
          produtoData,
          variacoesData,
          imagensData,
        ] = await Promise.all([
          buscarProdutoPorId(id),
          listarVariacoes(id),
          listarImagens(id),
        ]);

        setProduto(produtoData);
        setVariacoes(
          Array.isArray(variacoesData)
            ? variacoesData
            : []
        );
        setImagens(
          Array.isArray(imagensData)
            ? imagensData
            : []
        );
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarProduto();
  }, [id]);

  function adicionarProduto() {
    adicionarAoCarrinho(produto);
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
        <p className="text-red-700">
          {erro || 'Produto não encontrado.'}
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">

        <GaleriaProduto
          imagens={imagens}
          nome={produto.nome}
        />

        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[#74645c]">
                Produto
              </p>

              <h1 className="text-3xl font-semibold text-[#171511] mt-1">
                {produto.nome}
              </h1>
            </div>

            <BotaoFavorito
              favoritado={false}
              onToggle={() => {}}
            />
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
              <h2 className="font-medium text-[#171511] mb-3">
                Variações
              </h2>

              <div className="flex flex-wrap gap-2">
                {variacoes.map((variacao) => (
                  <button
                    key={variacao.id}
                    type="button"
                    className="border border-[#8e8980]/40 rounded-md px-4 py-2 text-sm text-[#171511] hover:border-[#746c5c]"
                  >
                    {variacao.cor ||
                      variacao.tamanho ||
                      `Variação ${variacao.id}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <Button
              onClick={adicionarProduto}
              variant="primary"
            >
              {adicionado ? (
                <>
                  <span className="inline-flex items-center justify-center gap-2">
                    <Check size={18} />
                    Adicionado ao carrinho
                  </span>
                </>
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
    </section>
  );
}

export default Produto;