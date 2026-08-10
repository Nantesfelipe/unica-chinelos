import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import Hero from '../components/Hero';
import CardProduto from '../components/CardProduto';

import { listarProdutos } from '../../services/product.service';
import Loading from '../../components/Loading';

function Home() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const dados = await listarProdutos();

        setProdutos(Array.isArray(dados) ? dados : []);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarProdutos();
  }, []);

  const produtosDestaque = produtos.slice(0, 4);

  return (
    <div>
      <Hero
        titulo="Conforto em cada passo"
        subtitulo="Encontre o chinelo ideal para você."
      />

      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-[#74645c]">
              Nossa coleção
            </p>

            <h2 className="text-2xl md:text-3xl font-semibold text-[#171511] mt-1">
              Produtos em destaque
            </h2>
          </div>

          <Link
            to="/produtos"
            className="inline-flex items-center gap-2 text-sm text-[#746c5c] hover:text-[#171511]"
          >
            Ver todos
            <ArrowRight size={16} />
          </Link>
        </div>

        {carregando && (
          <Loading text="Carregando produtos..." />
        )}

        {!carregando && erro && (
          <div className="bg-white border border-red-200 rounded-lg p-8 text-center">
            <p className="text-red-700">
              {erro}
            </p>
          </div>
        )}

        {!carregando && !erro && produtosDestaque.length === 0 && (
          <div className="bg-white border border-[#8e8980]/30 rounded-lg p-10 text-center">
            <p className="text-[#8e8980]">
              Os produtos aparecerão aqui.
            </p>
          </div>
        )}

        {!carregando && !erro && produtosDestaque.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {produtosDestaque.map((produto) => (
              <CardProduto
                key={produto.id}
                produto={produto}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;