import { useState, useEffect } from 'react';
import { listarProdutos } from '../../services/product.service';

function Home() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarProdutos()
      .then((dados) => setProdutos(dados))
      .catch((erro) => console.error(erro))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return <p className="text-center py-10 text-[#8c7184]">Carregando produtos...</p>;
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-semibold text-[#481346] mb-6">Em destaque</h1>

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
    </div>
  );
}

export default Home;