import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

import useCart from '../../hooks/useCart';

import ItemCarrinho from '../components/ItemCarrinho';

import formatCurrency from '../../utils/formatCurrency';

function Carrinho() {
  const {
    carrinho,
    aumentarQuantidade,
    diminuirQuantidade,
    removerDoCarrinho,
    totalCarrinho,
  } = useCart();

  if (carrinho.length === 0) {
    return (
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <ShoppingBag
          size={42}
          className="mx-auto text-[#8e8980]"
        />

        <h1 className="text-2xl font-semibold text-[#171511] mt-5">
          Seu carrinho está vazio
        </h1>

        <p className="text-[#8e8980] mt-2">
          Adicione produtos para continuar.
        </p>

        <Link
          to="/produtos"
          className="inline-block mt-7 bg-[#171511] text-[#e2dacc] px-6 py-3 rounded-md hover:bg-[#746c5c]"
        >
          Ver produtos
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold text-[#171511] mb-8">
        Meu carrinho
      </h1>

      <div className="bg-white rounded-lg p-5 sm:p-7">
        {carrinho.map((item) => (
          <ItemCarrinho
            key={item.id}
            item={item}
            onAumentar={() =>
              aumentarQuantidade(item.id)
            }
            onDiminuir={() =>
              diminuirQuantidade(item.id)
            }
            onRemover={() =>
              removerDoCarrinho(item.id)
            }
          />
        ))}

        <div className="flex items-center justify-between pt-4">
          <span className="font-medium text-[#171511]">
            Total
          </span>

          <span className="text-xl font-semibold text-[#171511]">
            {formatCurrency(totalCarrinho)}
          </span>
        </div>

        <Link
          to="/checkout"
          className="block text-center mt-6 bg-[#171511] text-[#e2dacc] rounded-md py-3 hover:bg-[#746c5c]"
        >
          Continuar para checkout
        </Link>
      </div>
    </section>
  );
}

export default Carrinho;