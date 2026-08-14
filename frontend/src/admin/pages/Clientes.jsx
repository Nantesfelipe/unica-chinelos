import { useEffect, useState } from 'react';

import {
  Search,
  User,
  ShoppingBag,
} from 'lucide-react';

import {
  listarClientes,
  buscarCliente,
} from '../../services/user.service';

import Loading from '../../components/Loading';

import formatCurrency from '../../utils/formatCurrency';

const STATUS_LABELS = {
  recebido: 'Recebido',
  em_separacao: 'Em separação',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

function Clientes() {
  const [clientes, setClientes] =
    useState([]);

  const [
    clienteSelecionado,
    setClienteSelecionado,
  ] = useState(null);

  const [busca, setBusca] =
    useState('');

  const [carregando, setCarregando] =
    useState(true);

  const [
    carregandoDetalhes,
    setCarregandoDetalhes,
  ] = useState(false);

  const [erro, setErro] =
    useState('');

  useEffect(() => {
    async function carregarClientes() {
      try {
        const dados =
          await listarClientes();

        setClientes(
          Array.isArray(dados)
            ? dados
            : []
        );
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarClientes();
  }, []);

  async function selecionarCliente(id) {
    setErro('');
    setCarregandoDetalhes(true);

    try {
      const cliente =
        await buscarCliente(id);

      setClienteSelecionado(
        cliente
      );
    } catch (error) {
      setErro(error.message);
      setClienteSelecionado(null);
    } finally {
      setCarregandoDetalhes(false);
    }
  }

  function formatarData(data) {
    if (!data) {
      return '—';
    }

    return new Date(
      data
    ).toLocaleDateString(
      'pt-BR'
    );
  }

  function obterClasseStatus(
    status
  ) {
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

  const clientesFiltrados =
    clientes.filter(
      (cliente) => {
        const termo =
          busca
            .toLowerCase()
            .trim();

        if (!termo) {
          return true;
        }

        return (
          cliente.nome
            ?.toLowerCase()
            .includes(termo) ||
          cliente.email
            ?.toLowerCase()
            .includes(termo)
        );
      }
    );

  if (carregando) {
    return (
      <Loading text="Carregando clientes..." />
    );
  }

  return (
    <div className="min-w-0">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#171511]">
          Clientes
        </h1>

        <p className="text-sm text-[#8e8980] mt-1">
          Consulte os clientes e seus pedidos.
        </p>
      </div>

      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-5">
          <p className="text-sm text-red-700">
            {erro}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-4 sm:gap-6">
        {/* Lista de clientes */}
        <div className="bg-white border border-[#8e8980]/20 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#8e8980]/20">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8e8980]"
              />

              <input
                type="text"
                value={busca}
                onChange={(event) =>
                  setBusca(
                    event.target.value
                  )
                }
                placeholder="Buscar cliente"
                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-[#8e8980]/30 bg-white text-sm text-[#171511] outline-none focus:border-[#746c5c]"
              />
            </div>
          </div>

          <div className="max-h-[620px] overflow-y-auto">
            {clientesFiltrados.length ===
            0 ? (
              <div className="p-8 text-center">
                <User
                  size={30}
                  className="mx-auto text-[#8e8980]"
                />

                <p className="text-sm text-[#8e8980] mt-3">
                  Nenhum cliente encontrado.
                </p>
              </div>
            ) : (
              clientesFiltrados.map(
                (cliente) => {
                  const selecionado =
                    clienteSelecionado?.id ===
                    cliente.id;

                  return (
                    <button
                      key={cliente.id}
                      type="button"
                      onClick={() =>
                        selecionarCliente(
                          cliente.id
                        )
                      }
                      className={`w-full text-left px-4 py-4 border-b border-[#8e8980]/10 transition-colors ${
                        selecionado
                          ? 'bg-[#e2dacc]'
                          : 'hover:bg-[#e2dacc]/40'
                      }`}
                    >
                      <p className="text-sm font-medium text-[#171511]">
                        {cliente.nome}
                      </p>

                      <p className="text-xs text-[#8e8980] mt-1 truncate">
                        {cliente.email}
                      </p>
                    </button>
                  );
                }
              )
            )}
          </div>
        </div>

        {/* Detalhes */}
        <div className="min-w-0">
          {carregandoDetalhes && (
            <div className="bg-white border border-[#8e8980]/20 rounded-lg p-6 sm:p-10">
              <Loading text="Carregando cliente..." />
            </div>
          )}

          {!carregandoDetalhes &&
            !clienteSelecionado && (
              <div className="bg-white border border-[#8e8980]/20 rounded-lg p-8 sm:p-12 text-center">
                <User
                  size={40}
                  className="mx-auto text-[#8e8980]"
                />

                <h2 className="text-lg font-medium text-[#171511] mt-4">
                  Selecione um cliente
                </h2>

                <p className="text-sm text-[#8e8980] mt-1">
                  Escolha um cliente na lista para visualizar seus pedidos.
                </p>
              </div>
            )}

          {!carregandoDetalhes &&
            clienteSelecionado && (
              <div className="space-y-6">
                {/* Informações do cliente */}
                <div className="bg-white border border-[#8e8980]/20 rounded-lg p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="text-xl font-semibold text-[#171511] break-words">
                        {clienteSelecionado.nome}
                      </h2>

                      <p className="text-sm text-[#8e8980] mt-1 break-all">
                        {clienteSelecionado.email}
                      </p>
                    </div>

                    <div className="w-11 h-11 rounded-full bg-[#e2dacc] flex items-center justify-center shrink-0">
                      <User
                        size={21}
                        className="text-[#746c5c]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    <div className="border border-[#8e8980]/20 rounded-md p-4">
                      <p className="text-xs text-[#8e8980]">
                        Cadastro
                      </p>

                      <p className="text-sm font-medium text-[#171511] mt-1">
                        {formatarData(
                          clienteSelecionado.created_at
                        )}
                      </p>
                    </div>

                    <div className="border border-[#8e8980]/20 rounded-md p-4">
                      <p className="text-xs text-[#8e8980]">
                        Total de pedidos
                      </p>

                      <p className="text-sm font-medium text-[#171511] mt-1">
                        {clienteSelecionado.total_pedidos}
                      </p>
                    </div>

                    <div className="border border-[#8e8980]/20 rounded-md p-4">
                      <p className="text-xs text-[#8e8980]">
                        Total de compras
                      </p>

                      <p className="text-sm font-medium text-[#171511] mt-1">
                        {formatCurrency(
                          clienteSelecionado.total_compras
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pedidos */}
                <div className="bg-white border border-[#8e8980]/20 rounded-lg overflow-hidden">
                  <div className="px-4 sm:px-6 py-5 border-b border-[#8e8980]/20">
                    <div className="flex items-center gap-2">
                      <ShoppingBag
                        size={19}
                        className="text-[#746c5c]"
                      />

                      <h2 className="text-lg font-semibold text-[#171511]">
                        Pedidos
                      </h2>
                    </div>
                  </div>

                  {clienteSelecionado.pedidos
                    ?.length ===
                  0 ? (
                    <div className="p-8 sm:p-10 text-center">
                      <p className="text-sm text-[#8e8980]">
                        Este cliente ainda não realizou nenhum pedido.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[650px] text-sm">
                        <thead>
                          <tr className="text-left text-[#8e8980] border-b border-[#8e8980]/20">
                            <th className="px-6 py-3 font-normal">
                              Pedido
                            </th>

                            <th className="px-6 py-3 font-normal">
                              Data
                            </th>

                            <th className="px-6 py-3 font-normal">
                              Status
                            </th>

                            <th className="px-6 py-3 font-normal">
                              Pagamento
                            </th>

                            <th className="px-6 py-3 font-normal text-right">
                              Total
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-[#8e8980]/10">
                          {clienteSelecionado.pedidos.map(
                            (pedido) => (
                              <tr
                                key={pedido.id}
                              >
                                <td className="px-6 py-4 font-medium text-[#171511]">
                                  #{pedido.id}
                                </td>

                                <td className="px-6 py-4 text-[#8e8980]">
                                  {formatarData(
                                    pedido.created_at
                                  )}
                                </td>

                                <td className="px-6 py-4">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${obterClasseStatus(
                                      pedido.status
                                    )}`}
                                  >
                                    {STATUS_LABELS[
                                      pedido.status
                                    ] ||
                                      pedido.status}
                                  </span>
                                </td>

                                <td className="px-6 py-4 text-[#8e8980]">
                                  {pedido.forma_pagamento ||
                                    '—'}
                                </td>

                                <td className="px-6 py-4 text-right font-medium text-[#171511]">
                                  {formatCurrency(
                                    pedido.valor_total
                                  )}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default Clientes;