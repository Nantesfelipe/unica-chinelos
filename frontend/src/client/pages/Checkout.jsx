import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';

import { finalizarPedido } from '../../services/order.service';

import Button from '../../components/Button';
import Loading from '../../components/Loading';

import formatCurrency from '../../utils/formatCurrency';

function Checkout() {
  const navigate = useNavigate();

  const { autenticado } = useAuth();

  const {
    carrinho,
    totalCarrinho,
    limparCarrinho,
  } = useCart();

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function handleFinalizar() {
    if (!autenticado) {
      navigate('/login');
      return;
    }

    setErro('');
    setCarregando(true);

    try {
      const itens = carrinho.map((item) => ({
        produto_id: item.id,
        quantidade: item.quantidade,
      }));

      await finalizarPedido({
        itens,
      });

      limparCarrinho();
      navigate('/pedidos');
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  if (carrinho.length === 0) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold text-[#171511]">
          Seu carrinho está vazio.
        </h1>

        <Link
          to="/produtos"
          className="inline-block mt-5 text-[#746c5c]"
        >
          Voltar para produtos
        </Link>
      </section>
    );
  }

  if (carregando) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-16">
        <Loading text="Finalizando pedido..." />
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold text-[#171511] mb-8">
        Checkout
      </h1>

      {!autenticado && (
        <div className="bg-white border border-[#8e8980]/30 rounded-lg p-5 mb-6">
          <p className="text-sm text-[#746c5c]">
            Você precisa estar logado para finalizar o pedido.
          </p>

          <Link
            to="/login"
            className="inline-block mt-3 text-sm font-medium text-[#171511]"
          >
            Entrar na conta
          </Link>
        </div>
      )}

      <div className="bg-white rounded-lg p-6">
        <h2 className="font-semibold text-[#171511]">
          Resumo do pedido
        </h2>

        <div className="mt-5 space-y-4">
          {carrinho.map((item) => (
            <div
              key={item.id}
              className="flex justify-between gap-4 text-sm"
            >
              <span className="text-[#746c5c]">
                {item.nome} × {item.quantidade}
              </span>

              <span className="text-[#171511] font-medium">
                {formatCurrency(
                  Number(item.preco) * item.quantidade
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-[#8e8980]/20 mt-6 pt-5 flex justify-between">
          <span className="font-semibold text-[#171511]">
            Total
          </span>

          <span className="font-semibold text-[#171511]">
            {formatCurrency(totalCarrinho)}
          </span>
        </div>

        {erro && (
          <p className="text-sm text-red-700 mt-5">
            {erro}
          </p>
        )}

        <div className="mt-6">
          <Button
            onClick={handleFinalizar}
            disabled={!autenticado}
          >
            Finalizar pedido
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Checkout;