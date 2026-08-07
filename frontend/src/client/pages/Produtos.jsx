import { useState, useEffect } from 'react';
import { listarProdutos, listarCategorias } from '../../services/product.service';

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busca, setBusca] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarCategorias().then(setCategorias).catch(console.error);
  }, []);

  useEffect(() => {
    setCarregando(true);

    const filtros = {};
    if (busca) filtros.busca = busca;
    if (categoriaId) filtros.categoriaId = categoriaId;

    listarProdutos(filtros)
      .then(setProdutos)
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, [busca, categoriaId]);

  return (
    <div className="px-6 py-8">
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por nome"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1 max-w-xs"
        />

        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="">Todas as categorias</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nome}</option>
          ))}
        </select>
      </div>

      {carregando ? (
        <p className="text-center py-10 text-[#8c7184]">Carregando produtos...</p>
      ) : produtos.length === 0 ? (
        <p className="text-center py-10 text-[#8c7184]">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {produtos.map((produto) => (
            <div key={produto.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-[#ece8ec] h-28" />
              <div className="p-3">
                <p className="text-sm text-[#481346]">{produto.nome}</p>
                <p className="text-sm font-semibold text-[#481346]">
                  R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Produtos;