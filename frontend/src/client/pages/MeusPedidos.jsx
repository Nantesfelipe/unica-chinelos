import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package } from 'lucide-react';

import { listarPedidos } from '../../services/order.service';

import useAuth from '../../hooks/useAuth';

import Loading from '../../components/Loading';

import formatCurrency from '../../utils/formatCurrency';

import { ORDER_STATUS_LABELS } from '../../utils/constants';


function MeusPedidos() {
  const { autenticado } = useAuth();

  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!autenticado) {
      setCarregando(false);
      return;
    }

    async function carregarPedidos() {
      try {
        const dados = await listarPedidos();
        setPedidos(Array.isArray(dados) ? dados : []);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarPedidos();
  }, [autenticado]);

  if (!autenticado) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <ShoppingBag size={40} className="mx-auto text-[#8e8980]" />

        <h1 className="text-2xl font-semibold text-[#171511] mt-5">
          Faça login para visualizar seus pedidos.
        </h1>

        <Link to="/login" className="inline-block mt-5 text-[#746c5c]">
          Entrar
        </Link>
      </section>
    );
  }

  if (carregando) {
    return (
      <section className="max-w-5xl mx-auto px-6 py-16">
        <Loading text="Carregando seus pedidos..." />
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <p className="text-sm text-[#74645c]">Minha conta</p>

      <h1 className="text-3xl font-semibold text-[#171511] mt-1 mb-8">
        Meus pedidos
      </h1>

      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-5 mb-6">
          <p className="text-sm text-red-700">{erro}</p>
        </div>
      )}

      {!erro && pedidos.length === 0 && (
        <div className="bg-white rounded-lg p-10 text-center">
          <Package size={40} className="mx-auto text-[#8e8980]" />

          <p className="text-[#8e8980] mt-4">
            Você ainda não possui pedidos.
          </p>

          <Link to="/produtos" className="inline-block mt-5 text-[#746c5c]">
            Ver produtos
          </Link>
        </div>
      )}

      {!erro && pedidos.length > 0 && (
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="bg-white rounded-lg p-5 border border-[#8e8980]/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-medium text-[#171511]">
                    Pedido #{pedido.id}
                  </p>

                  <p className="text-sm text-[#8e8980] mt-1 capitalize">
                    Status: {ORDER_STATUS_LABELS[pedido.status] || pedido.status}
                  </p>
                </div>

                <span className="font-semibold text-[#171511]">
                  {formatCurrency(pedido.valor_total || 0)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default MeusPedidos;