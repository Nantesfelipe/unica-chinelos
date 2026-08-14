import { useEffect, useState } from 'react';

import {
  Package,
  ShoppingBag,
  Tags,
} from 'lucide-react';

import { listarProdutos } from '../../services/product.service';
import { listarCategorias } from '../../services/category.service';
import { listarTodosPedidos } from '../../services/order.service';
import { ORDER_STATUS_LABELS } from '../../utils/constants';

import Loading from '../../components/Loading';

function CardResumo({
  icon: Icon,
  label,
  valor,
}) {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-5 border border-[#8e8980]/20">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[#8e8980]">
          {label}
        </p>

        <Icon
          size={18}
          className="shrink-0 text-[#746c5c]"
        />
      </div>

      <p className="text-2xl font-semibold text-[#171511] mt-3">
        {valor}
      </p>
    </div>
  );
}

function Dashboard() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] =
    useState(true);

  useEffect(() => {
    Promise.all([
      listarProdutos({
        incluirInativos: true,
      }),
      listarCategorias(),
      listarTodosPedidos(),
    ])
      .then(([p, c, o]) => {
        setProdutos(
          Array.isArray(p) ? p : []
        );

        setCategorias(
          Array.isArray(c) ? c : []
        );

        setPedidos(
          Array.isArray(o) ? o : []
        );
      })
      .catch(console.error)
      .finally(() =>
        setCarregando(false)
      );
  }, []);

  if (carregando) {
    return (
      <Loading text="Carregando dashboard..." />
    );
  }

  const pedidosRecentes = [...pedidos]
    .sort(
      (a, b) =>
        new Date(b.created_at) -
        new Date(a.created_at)
    )
    .slice(0, 5);

  return (
    <div className="min-w-0">

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#171511]">
          Visão geral
        </h1>

        <p className="text-sm text-[#8e8980] mt-1">
          Acompanhe os principais dados da loja.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <CardResumo
          icon={Package}
          label="Produtos"
          valor={produtos.length}
        />

        <CardResumo
          icon={Tags}
          label="Categorias"
          valor={categorias.length}
        />

        <CardResumo
          icon={ShoppingBag}
          label="Pedidos"
          valor={pedidos.length}
        />
      </div>

      <div className="bg-white rounded-lg border border-[#8e8980]/20 overflow-hidden">
        <p className="text-sm font-medium text-[#171511] px-4 sm:px-5 py-4 border-b border-[#8e8980]/20">
          Pedidos recentes
        </p>

        {pedidosRecentes.length === 0 ? (
          <p className="text-sm text-[#8e8980] px-4 sm:px-5 py-6">
            Nenhum pedido ainda.
          </p>
        ) : (
          <div className="divide-y divide-[#8e8980]/10">
            {pedidosRecentes.map(
              (pedido) => (
                <div
                  key={pedido.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-4 sm:px-5 py-3 text-sm"
                >
                  <span className="text-[#171511]">
                    Pedido #{pedido.id}
                  </span>

                  <span className="text-[#8e8980]">
                    {
                      ORDER_STATUS_LABELS[
                        pedido.status
                      ] ||
                      pedido.status
                    }
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;