import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  listarProdutos,
} from '../../services/product.service';

import CardProduto from '../components/CardProduto';
import BarraPesquisa from '../components/BarraPesquisa';

import Loading from '../../components/Loading';

function Produtos() {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const [
    produtos,
    setProdutos,
  ] = useState([]);

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  const [
    erro,
    setErro,
  ] = useState('');

  const buscaUrl =
    searchParams.get('busca') || '';

  const tipoProdutoIdUrl =
    searchParams.get(
      'tipoProdutoId'
    ) || '';

  const [
    busca,
    setBusca,
  ] = useState(buscaUrl);

  useEffect(() => {
    async function carregarProdutos() {
      setCarregando(true);
      setErro('');

      try {
        const dados =
          await listarProdutos({
            busca: buscaUrl,
            tipoProdutoId:
              tipoProdutoIdUrl ||
              undefined,
          });

        setProdutos(
          Array.isArray(dados)
            ? dados
            : []
        );
      } catch (error) {
        setErro(
          error.message
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarProdutos();
  }, [
    buscaUrl,
    tipoProdutoIdUrl,
  ]);

  useEffect(() => {
    setBusca(
      buscaUrl
    );
  }, [
    buscaUrl,
  ]);

  function alterarBusca(
    valor
  ) {
    setBusca(valor);
  }

  function confirmarBusca() {
    const termo =
      busca.trim();

    const novosParametros =
      new URLSearchParams();

    if (termo) {
      novosParametros.set(
        'busca',
        termo
      );
    }

    if (tipoProdutoIdUrl) {
      novosParametros.set(
        'tipoProdutoId',
        tipoProdutoIdUrl
      );
    }

    setSearchParams(
      novosParametros
    );
  }

  /*
   * A API já realiza o filtro por tipo.
   * Aqui mantemos apenas o filtro visual
   * da busca por nome.
   */
  const termo =
    busca
      .toLowerCase()
      .trim();

  const produtosFiltrados =
    produtos.filter(
      (produto) => {
        const nome =
          String(
            produto.nome ||
              ''
          ).toLowerCase();

        return nome.includes(
          termo
        );
      }
    );

  if (carregando) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <Loading
          text="Carregando produtos..."
        />
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
        <div>
          <p className="text-sm text-[#74645c]">
            Nossa coleção
          </p>

          <h1 className="text-3xl font-semibold text-[#171511] mt-1">
            Produtos
          </h1>
        </div>

        <BarraPesquisa
          value={busca}
          onChange={
            alterarBusca
          }
          onSubmit={
            confirmarBusca
          }
        />
      </div>

      {tipoProdutoIdUrl && (
        <p className="text-sm text-[#746c5c] mb-5">
          Produtos deste tipo
        </p>
      )}

      {erro && (
        <div className="bg-white border border-red-200 rounded-lg p-6 mb-6">
          <p className="text-red-700">
            {erro}
          </p>
        </div>
      )}

      {!erro &&
        produtosFiltrados.length ===
          0 && (
          <div className="bg-white border border-[#8e8980]/30 rounded-lg p-10 text-center">
            <p className="text-[#8e8980]">
              Nenhum produto encontrado.
            </p>
          </div>
        )}

      {!erro &&
        produtosFiltrados.length >
          0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {produtosFiltrados.map(
              (produto) => (
                <CardProduto
                  key={
                    produto.id
                  }
                  produto={
                    produto
                  }
                />
              )
            )}
          </div>
        )}
    </section>
  );
}

export default Produtos;