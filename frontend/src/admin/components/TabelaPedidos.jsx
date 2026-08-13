import { Eye, Package } from 'lucide-react';

import formatCurrency from '../../utils/formatCurrency';

const STATUS_LABELS = {
  recebido: 'Recebido',
  em_separacao: 'Em separação',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

const STATUS_OPTIONS = [
  {
    value: 'recebido',
    label: 'Recebido',
  },
  {
    value: 'em_separacao',
    label: 'Em separação',
  },
  {
    value: 'enviado',
    label: 'Enviado',
  },
  {
    value: 'entregue',
    label: 'Entregue',
  },
  {
    value: 'cancelado',
    label: 'Cancelado',
  },
];

function obterClasseStatus(status) {
  switch (status) {
    case 'entregue':
      return 'bg-green-100 text-green-800';

    case 'cancelado':
      return 'bg-red-100 text-red-800';

    case 'enviado':
      return 'bg-blue-100 text-blue-800';

    case 'em_separacao':
      return 'bg-yellow-100 text-yellow-800';

    default:
      return 'bg-[#e2dacc] text-[#746c5c]';
  }
}

function formatarData(data) {
  if (!data) {
    return '—';
  }

  return new Date(data).toLocaleDateString('pt-BR');
}

function TabelaPedidos({
  pedidos,
  onSelecionar,
  onAlterarStatus,
  atualizandoStatusId,
}) {
  if (pedidos.length === 0) {
    return (
      <div className="bg-white border border-[#8e8980]/20 rounded-lg p-10 text-center">
        <Package
          size={32}
          className="mx-auto text-[#8e8980]"
        />

        <p className="text-sm text-[#8e8980] mt-3">
          Nenhum pedido encontrado.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#8e8980]/20 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#8e8980] border-b border-[#8e8980]/20">
              <th className="px-5 py-3 font-normal">
                Pedido
              </th>

              <th className="px-5 py-3 font-normal">
                Cliente
              </th>

              <th className="px-5 py-3 font-normal">
                Data
              </th>

              <th className="px-5 py-3 font-normal">
                Status
              </th>

              <th className="px-5 py-3 font-normal">
                Total
              </th>

              <th className="px-5 py-3 font-normal" />
            </tr>
          </thead>

          <tbody className="divide-y divide-[#8e8980]/10">
            {pedidos.map((pedido) => {
              const atualizando =
                atualizandoStatusId === pedido.id;

              return (
                <tr key={pedido.id}>
                  <td className="px-5 py-4 font-medium text-[#171511]">
                    #{pedido.id}
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-[#171511] font-medium">
                      {pedido.usuario_nome}
                    </p>

                    <p className="text-xs text-[#8e8980] mt-1">
                      {pedido.usuario_email}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-[#8e8980]">
                    {formatarData(pedido.created_at)}
                  </td>

                  <td className="px-5 py-4">
                    <select
                      value={pedido.status}
                      onChange={(event) =>
                        onAlterarStatus(
                          pedido.id,
                          event.target.value
                        )
                      }
                      disabled={atualizando}
                      className={`text-xs px-3 py-2 rounded-md border border-transparent outline-none ${obterClasseStatus(
                        pedido.status
                      )} ${
                        atualizando
                          ? 'opacity-50 cursor-not-allowed'
                          : 'cursor-pointer'
                      }`}
                      title="Alterar status do pedido"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option
                          key={status.value}
                          value={status.value}
                        >
                          {status.label}
                        </option>
                      ))}
                    </select>

                    {atualizando && (
                      <span className="text-xs text-[#8e8980] ml-2">
                        Salvando...
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 font-medium text-[#171511]">
                    {formatCurrency(pedido.valor_total)}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        onSelecionar(pedido.id)
                      }
                      title="Ver pedido"
                      className="text-[#746c5c] hover:text-[#171511]"
                    >
                      <Eye size={17} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TabelaPedidos;