import { useEffect, useState } from 'react';

import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import {
  listarTodosPedidos,
  buscarPedidoPorId,
  atualizarStatusPedido,
} from '../../services/order.service';

import TabelaPedidos from '../components/TabelaPedidos';

import Loading from '../../components/Loading';

import formatCurrency from '../../utils/formatCurrency';

const STATUS_OPTIONS = [
  { value: 'todos', label: 'Todos os status' },
  { value: 'recebido', label: 'Recebido' },
  { value: 'em_separacao', label: 'Em separação' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'entregue', label: 'Entregue' },
  { value: 'cancelado', label: 'Cancelado' },
];

const POR_PAGINA = 20;

function formatarData(data) {
  if (!data) return '—';
  return new Date(data).toLocaleDateString('pt-BR');
}

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  const [busca, setBusca] = useState('');
  const [buscaDebounced, setBuscaDebounced] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('todos');

  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);

  const [carregando, setCarregando] = useState(true);
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);
  const [atualizandoStatus, setAtualizandoStatus] = useState(false);
  const [atualizandoStatusId, setAtualizandoStatusId] = useState(null);

  const [erro, setErro] = useState('');

  // Debounce da busca — espera 400ms sem digitar antes de consultar o backend
  useEffect(() => {
    const timer = setTimeout(() => {
      setBuscaDebounced(busca);
      setPagina(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [busca]);

  useEffect(() => {
    setPagina(1);
  }, [statusFiltro]);

  useEffect(() => {
    async function carregarPedidos() {
      setCarregando(true);
      setErro('');

      try {
        const resultado = await listarTodosPedidos({
          pagina,
          porPagina: POR_PAGINA,
          busca: buscaDebounced,
          status: statusFiltro,
        });

        setPedidos(resultado.dados || []);
        setTotalPaginas(resultado.totalPaginas || 1);
        setTotal(resultado.total || 0);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarPedidos();
  }, [pagina, buscaDebounced, statusFiltro]);

  async function selecionarPedido(id) {
    setErro('');
    setCarregandoDetalhes(true);

    try {
      const pedido = await buscarPedidoPorId(id);
      setPedidoSelecionado(pedido);
    } catch (error) {
      setErro(error.message);
      setPedidoSelecionado(null);
    } finally {
      setCarregandoDetalhes(false);
    }
  }

  async function alterarStatus(status) {
    if (!pedidoSelecionado) return;

    setErro('');
    setAtualizandoStatus(true);

    try {
      const pedidoAtualizado = await atualizarStatusPedido(
        pedidoSelecionado.id,
        { status }
      );

      setPedidoSelecionado((atual) => ({
        ...atual,
        ...pedidoAtualizado,
      }));

      setPedidos((atuais) =>
        atuais.map((pedido) =>
          pedido.id === pedidoAtualizado.id
            ? { ...pedido, ...pedidoAtualizado }
            : pedido
        )
      );
    } catch (error) {
      setErro(error.message);
    } finally {
      setAtualizandoStatus(false);
    }
  }

  async function alterarStatusTabela(id, status) {
    setErro('');
    setAtualizandoStatusId(id);

    try {
      const pedidoAtualizado = await atualizarStatusPedido(id, { status });

      setPedidos((atuais) =>
        atuais.map((pedido) =>
          pedido.id === pedidoAtualizado.id
            ? { ...pedido, ...pedidoAtualizado }
            : pedido
        )
      );

      if (pedidoSelecionado && pedidoSelecionado.id === pedidoAtualizado.id) {
        setPedidoSelecionado((atual) => ({
          ...atual,
          ...pedidoAtualizado,
        }));
      }
    } catch (error) {
      setErro(error.message);
    } finally {
      setAtualizandoStatusId(null);
    }
  }

  function obterSubtotal(item) {
    return Number(item.preco_unitario) * Number(item.quantidade);
  }

  if (carregando && pedidos.length === 0) {
    return <Loading text="Carregando pedidos..." />;
  }

  return (
    <div className="min-w-0">
      <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4 sm:gap-5 mb-6">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-[#171511]">Pedidos</h1>
          <p className="text-sm text-[#8e8980] mt-1">
            Gerencie os pedidos realizados pelos clientes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8e8980]"
            />
            <input
              type="text"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar pedido ou cliente"
              className="w-full sm:w-72 pl-10 pr-4 py-2.5 rounded-md border border-[#8e8980]/30 bg-white text-sm text-[#171511] outline-none focus:border-[#746c5c]"
            />
          </div>

          <select
            value={statusFiltro}
            onChange={(event) => setStatusFiltro(event.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-md border border-[#8e8980]/30 bg-white text-sm text-[#171511] outline-none focus:border-[#746c5c]"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-5">
          <p className="text-sm text-red-700">{erro}</p>
        </div>
      )}

      <TabelaPedidos
        pedidos={pedidos}
        onSelecionar={selecionarPedido}
        onAlterarStatus={alterarStatusTabela}
        atualizandoStatusId={atualizandoStatusId}
      />

      {pedidos.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
          <p className="text-sm text-[#8e8980]">
            {total} pedido{total !== 1 ? 's' : ''} encontrado
            {total !== 1 ? 's' : ''} — página {pagina} de {totalPaginas}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={pagina === 1 || carregando}
              className="p-2 rounded-md border border-[#8e8980]/30 text-[#171511] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#e2dacc]/40"
              title="Página anterior"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={pagina === totalPaginas || carregando}
              className="p-2 rounded-md border border-[#8e8980]/30 text-[#171511] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#e2dacc]/40"
              title="Próxima página"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {carregandoDetalhes && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-md">
            <Loading text="Carregando pedido..." />
          </div>
        </div>
      )}

      {pedidoSelecionado && !carregandoDetalhes && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-3xl max-h-[calc(100vh-1.5rem)] sm:max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-[#8e8980]/20 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs text-[#8e8980]">Pedido</p>
                <h2 className="text-xl font-semibold text-[#171511]">
                  #{pedidoSelecionado.id}
                </h2>
                <p className="text-sm text-[#8e8980] mt-1 break-words">
                  {pedidoSelecionado.usuario_nome}
                  {' · '}
                  {pedidoSelecionado.usuario_email}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPedidoSelecionado(null)}
                className="shrink-0 text-[#8e8980] hover:text-[#171511]"
                title="Fechar"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-[#8e8980]/20 rounded-md p-4">
                  <p className="text-xs text-[#8e8980]">Data</p>
                  <p className="text-sm font-medium text-[#171511] mt-1">
                    {formatarData(pedidoSelecionado.created_at)}
                  </p>
                </div>

                <div className="border border-[#8e8980]/20 rounded-md p-4">
                  <p className="text-xs text-[#8e8980]">Total</p>
                  <p className="text-sm font-medium text-[#171511] mt-1">
                    {formatCurrency(pedidoSelecionado.valor_final)}
                  </p>
                </div>

                <div className="border border-[#8e8980]/20 rounded-md p-4">
                  <p className="text-xs text-[#8e8980]">Pagamento</p>
                  <p className="text-sm font-medium text-[#171511] mt-1">
                    {pedidoSelecionado.forma_pagamento || '—'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#171511] mb-2">
                  Status do pedido
                </label>

                <select
                  value={pedidoSelecionado.status}
                  onChange={(event) => alterarStatus(event.target.value)}
                  disabled={atualizandoStatus}
                  className="w-full px-4 py-3 rounded-md border border-[#8e8980]/30 bg-white text-sm text-[#171511] outline-none focus:border-[#746c5c] disabled:opacity-50"
                >
                  {STATUS_OPTIONS.filter((status) => status.value !== 'todos').map(
                    (status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    )
                  )}
                </select>

                {atualizandoStatus && (
                  <p className="text-xs text-[#8e8980] mt-2">
                    Atualizando status...
                  </p>
                )}
              </div>

              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-[#171511] mb-3">
                  Itens do pedido
                </h3>

                {pedidoSelecionado.itens?.length === 0 ? (
                  <div className="border border-[#8e8980]/20 rounded-md p-6 text-center">
                    <p className="text-sm text-[#8e8980]">
                      Nenhum item encontrado.
                    </p>
                  </div>
                ) : (
                  <div className="border border-[#8e8980]/20 rounded-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[650px] text-sm">
                        <thead>
                          <tr className="text-left text-[#8e8980] border-b border-[#8e8980]/20">
                            <th className="px-4 py-3 font-normal">Produto</th>
                            <th className="px-4 py-3 font-normal">Tamanho</th>
                            <th className="px-4 py-3 font-normal">Cor</th>
                            <th className="px-4 py-3 font-normal">Qtd.</th>
                            <th className="px-4 py-3 font-normal">Unitário</th>
                            <th className="px-4 py-3 font-normal text-right">
                              Subtotal
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-[#8e8980]/10">
                          {pedidoSelecionado.itens.map((item) => (
                            <tr key={item.id}>
                              <td className="px-4 py-3 text-[#171511] font-medium">
                                {item.produto}
                              </td>
                              <td className="px-4 py-3 text-[#8e8980]">
                                {item.tamanho || '—'}
                              </td>
                              <td className="px-4 py-3 text-[#8e8980]">
                                {item.cor || '—'}
                              </td>
                              <td className="px-4 py-3 text-[#171511]">
                                {item.quantidade}
                              </td>
                              <td className="px-4 py-3 text-[#8e8980]">
                                {formatCurrency(item.preco_unitario)}
                              </td>
                              <td className="px-4 py-3 text-right font-medium text-[#171511]">
                                {formatCurrency(obterSubtotal(item))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-[#8e8980]/20 pt-5 space-y-1">
                <div className="flex justify-between text-sm text-[#8e8980]">
                  <span>Subtotal</span>
                  <span>{formatCurrency(pedidoSelecionado.valor_total)}</span>
                </div>

                {Number(pedidoSelecionado.valor_desconto) > 0 && (
                  <div className="flex justify-between text-sm text-green-700">
                    <span>Desconto</span>
                    <span>-{formatCurrency(pedidoSelecionado.valor_desconto)}</span>
                  </div>
                )}

                {Number(pedidoSelecionado.valor_frete) > 0 && (
                  <div className="flex justify-between text-sm text-[#8e8980]">
                    <span>Frete</span>
                    <span>{formatCurrency(pedidoSelecionado.valor_frete)}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2">
                  <span className="text-sm text-[#8e8980]">Total do pedido</span>
                  <span className="text-xl font-semibold text-[#171511]">
                    {formatCurrency(pedidoSelecionado.valor_final)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pedidos;