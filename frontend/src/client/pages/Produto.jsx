import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { buscarProdutoPorId, listarVariacoes, listarImagens } from '../../services/product.service';

function Produto() {
  const { id } = useParams();

  const [produto, setProduto] = useState(null);
  const [variacoes, setVariacoes] = useState([]);
  const [imagens, setImagens] = useState([]);
  const [variacaoSelecionada, setVariacaoSelecionada] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setCarregando(true);

    Promise.all([
      buscarProdutoPorId(id),
      listarVariacoes(id),
      listarImagens(id),
    ])
      .then(([dadosProduto, dadosVariacoes, dadosImagens]) => {
        setProduto(dadosProduto);
        setVariacoes(dadosVariacoes);
        setImagens(dadosImagens);
        setVariacaoSelecionada(dadosVariacoes[0] || null);
      })
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, [id]);

  if (carregando) {
    return <p className="text-center py-10 text-[#8c7184]">Carregando produto...</p>;
  }

  if (!produto) {
    return <p className="text-center py-10 text-[#8c7184]">Produto não encontrado.</p>;
  }

  return (
    <div className="px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="bg-[#ece8ec] rounded-lg h-64 mb-3">
          {imagens[0] && (
            <img src={imagens[0].url} alt={produto.nome} className="w-full h-full object-cover rounded-lg" />
          )}
        </div>
        <div className="flex gap-2">
          {imagens.map((img) => (
            <img key={img.id} src={img.url} alt="" className="w-14 h-14 rounded object-cover" />
          ))}
        </div>
      </div>

      <div>
        <h1 className="text-xl font-semibold text-[#481346] mb-1">{produto.nome}</h1>
        <p className="text-2xl font-semibold text-[#481346] mb-4">
          R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
        </p>

        <p className="text-sm text-[#8c7184] mb-2">Tamanho</p>
        <div className="flex gap-2 mb-6">
          {variacoes.map((v) => (
            <button
              key={v.id}
              onClick={() => setVariacaoSelecionada(v)}
              className={`px-4 py-2 rounded-md text-sm border ${
                variacaoSelecionada?.id === v.id
                  ? 'border-[#a47ea4] text-[#481346]'
                  : 'border-gray-300 text-gray-500'
              }`}
            >
              {v.tamanho}
            </button>
          ))}
        </div>

        <p className="text-sm text-[#8c7184] mb-4">
          {variacaoSelecionada?.estoque > 0
            ? `${variacaoSelecionada.estoque} em estoque`
            : 'Sem estoque para essa variação'}
        </p>

        <button
          disabled={!variacaoSelecionada || variacaoSelecionada.estoque === 0}
          className="bg-[#481346] text-white px-6 py-3 rounded-md text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Adicionar ao carrinho
        </button>

        <p className="text-sm text-[#8c7184] mt-6">{produto.descricao}</p>
      </div>
    </div>
  );
}

export default Produto;