import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  ShoppingBag,
  Package,
  MapPin,
  CreditCard,
  ChevronDown,
  ChevronUp,
  ImageOff,
  CalendarDays,
} from 'lucide-react';

import {
  listarPedidos,
  buscarPedidoPorId,
  cancelarPedido,
} from '../../services/order.service';

import useAuth from '../../hooks/useAuth';

import Loading from '../../components/Loading';

import formatCurrency from '../../utils/formatCurrency';

import {
  ORDER_STATUS_LABELS,
} from '../../utils/constants';

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

function obterEndereco(pedido) {
  const partes = [];

  if (
    pedido.logradouro_entrega ||
    pedido.numero_entrega
  ) {
    partes.push(
      [
        pedido.logradouro_entrega,
        pedido.numero_entrega,
      ]
        .filter(Boolean)
        .join(', ')
    );
  }

  if (
    pedido.complemento_entrega
  ) {
    partes.push(
      pedido.complemento_entrega
    );
  }

  if (
    pedido.bairro_entrega
  ) {
    partes.push(
      pedido.bairro_entrega
    );
  }

  if (
    pedido.cidade_entrega ||
    pedido.estado_entrega
  ) {
    partes.push(
      [
        pedido.cidade_entrega,
        pedido.estado_entrega,
      ]
        .filter(Boolean)
        .join(' - ')
    );
  }

  if (pedido.cep_entrega) {
    partes.push(
      `CEP: ${pedido.cep_entrega}`
    );
  }

  return partes;
}

function MeusPedidos() {
  const { autenticado } =
    useAuth();

  const [pedidos, setPedidos] =
    useState([]);

  const [
    pedidoAberto,
    setPedidoAberto,
  ] = useState(null);

  const [
    detalhes,
    setDetalhes,
  ] = useState({});

  const [
    carregandoDetalhes,
    setCarregandoDetalhes,
  ] = useState(false);

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  const [
    cancelandoPedido,
    setCancelandoPedido,
  ] = useState(null);

  const [erro, setErro] =
    useState('');

  useEffect(() => {
    if (!autenticado) {
      setCarregando(false);
      return;
    }

    async function carregarPedidos() {
      try {
        const dados =
          await listarPedidos();

        setPedidos(
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

    carregarPedidos();
  }, [autenticado]);

  async function alternarDetalhes(
    pedidoId
  ) {
    if (
      pedidoAberto === pedidoId
    ) {
      setPedidoAberto(null);
      return;
    }

    setErro('');
    setPedidoAberto(
      pedidoId
    );

    if (detalhes[pedidoId]) {
      return;
    }

    setCarregandoDetalhes(true);

    try {
      const pedido =
        await buscarPedidoPorId(
          pedidoId
        );

      setDetalhes(
        (atual) => ({
          ...atual,
          [pedidoId]: pedido,
        })
      );
    } catch (error) {
      setErro(error.message);
      setPedidoAberto(null);
    } finally {
      setCarregandoDetalhes(false);
    }
  }

  async function handleCancelarPedido(
    pedidoId
  ) {
    const confirmar =
      window.confirm(
        'Tem certeza que deseja cancelar este pedido?'
      );

    if (!confirmar) {
      return;
    }

    setErro('');
    setCancelandoPedido(
      pedidoId
    );

    try {
      const pedidoAtualizado =
        await cancelarPedido(
          pedidoId
        );

      setPedidos(
        (atuais) =>
          atuais.map((pedido) =>
            pedido.id === pedidoId
              ? {
                  ...pedido,
                  ...pedidoAtualizado,
                }
              : pedido
          )
      );

      setDetalhes(
        (atuais) => ({
          ...atuais,
          [pedidoId]:
            atuais[pedidoId]
              ? {
                  ...atuais[pedidoId],
                  ...pedidoAtualizado,
                }
              : atuais[pedidoId],
        })
      );
    } catch (error) {
      setErro(error.message);
    } finally {
      setCancelandoPedido(
        null
      );
    }
  }

  if (!autenticado) {
    return (
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <ShoppingBag
          size={40}
          className="mx-auto text-[#8e8980]"
        />

        <h1 className="text-2xl font-semibold text-[#171511] mt-5">
          Faça login para visualizar seus pedidos.
        </h1>

        <Link
          to="/login"
          className="inline-block mt-5 text-[#746c5c]"
        >
          Entrar
        </Link>
      </section>
    );
  }

  if (carregando) {
    return (
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <Loading text="Carregando seus pedidos..." />
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <p className="text-sm text-[#74645c]">
        Minha conta
      </p>

      <h1 className="text-3xl font-semibold text-[#171511] mt-1 mb-8">
        Meus pedidos
      </h1>

      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-5 mb-6">
          <p className="text-sm text-red-700">
            {erro}
          </p>
        </div>
      )}

      {!erro &&
        pedidos.length === 0 && (
          <div className="bg-white rounded-lg p-10 text-center">
            <Package
              size={40}
              className="mx-auto text-[#8e8980]"
            />

            <p className="text-[#8e8980] mt-4">
              Você ainda não possui pedidos.
            </p>

            <Link
              to="/produtos"
              className="inline-block mt-5 text-[#746c5c]"
            >
              Ver produtos
            </Link>
          </div>
        )}

      {!erro &&
        pedidos.length > 0 && (
          <div className="space-y-5">
            {pedidos.map(
              (pedido) => {
                const aberto =
                  pedidoAberto ===
                  pedido.id;

                const detalhe =
                  detalhes[
                    pedido.id
                  ];

                const endereco =
                  detalhe
                    ? obterEndereco(
                        detalhe
                      )
                    : [];

                return (
                  <article
                    key={pedido.id}
                    className="bg-white border border-[#8e8980]/20 rounded-lg overflow-hidden"
                  >
                    {/* Cabeçalho */}
                    <div className="p-4 sm:p-5">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h2 className="font-semibold text-[#171511]">
                              Pedido #
                              {pedido.id}
                            </h2>

                            <span
                              className={`text-xs px-2.5 py-1 rounded-full ${obterClasseStatus(
                                pedido.status
                              )}`}
                            >
                              {ORDER_STATUS_LABELS[
                                pedido.status
                              ] ||
                                pedido.status}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-[#8e8980]">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays
                                size={15}
                              />

                              {formatarData(
                                pedido.created_at
                              )}
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                              <CreditCard
                                size={15}
                              />

                              {pedido.forma_pagamento ||
                                '—'}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <p className="text-xs text-[#8e8980]">
                              Total
                            </p>

                            <p className="text-lg font-semibold text-[#171511]">
                              {formatCurrency(
                                pedido.valor_total ||
                                  0
                              )}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            {pedido.status ===
                              'recebido' && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleCancelarPedido(
                                    pedido.id
                                  )
                                }
                                disabled={
                                  cancelandoPedido ===
                                  pedido.id
                                }
                                className="inline-flex items-center justify-center px-4 py-2.5 rounded-md border border-red-200 text-sm text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {cancelandoPedido ===
                                pedido.id
                                  ? 'Cancelando...'
                                  : 'Cancelar pedido'}
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                alternarDetalhes(
                                  pedido.id
                                )
                              }
                              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-[#8e8980]/30 text-sm text-[#171511] hover:border-[#746c5c] transition-colors"
                            >
                              {aberto
                                ? 'Ocultar'
                                : 'Detalhes'}

                              {aberto ? (
                                <ChevronUp
                                  size={17}
                                />
                              ) : (
                                <ChevronDown
                                  size={17}
                                />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detalhes */}
                    {aberto && (
                      <div className="border-t border-[#8e8980]/20 bg-[#faf9f7] p-4 sm:p-5">
                        {carregandoDetalhes &&
                          !detalhe && (
                            <Loading text="Carregando detalhes..." />
                          )}

                        {detalhe && (
                          <div className="space-y-6">
                            {/* Resumo */}
                            <div>
                              <h3 className="text-sm font-semibold text-[#171511] mb-3">
                                Resumo do pedido
                              </h3>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="bg-white rounded-md border border-[#8e8980]/20 p-4">
                                  <p className="text-xs text-[#8e8980]">
                                    Status
                                  </p>

                                  <p className="text-sm font-medium text-[#171511] mt-1">
                                    {ORDER_STATUS_LABELS[
                                      detalhe.status
                                    ] ||
                                      detalhe.status}
                                  </p>
                                </div>

                                <div className="bg-white rounded-md border border-[#8e8980]/20 p-4">
                                  <p className="text-xs text-[#8e8980]">
                                    Pagamento
                                  </p>

                                  <p className="text-sm font-medium text-[#171511] mt-1">
                                    {detalhe.forma_pagamento ||
                                      '—'}
                                  </p>
                                </div>

                                <div className="bg-white rounded-md border border-[#8e8980]/20 p-4">
                                  <p className="text-xs text-[#8e8980]">
                                    Data
                                  </p>

                                  <p className="text-sm font-medium text-[#171511] mt-1">
                                    {formatarData(
                                      detalhe.created_at
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Endereço */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <MapPin
                                  size={17}
                                  className="text-[#746c5c]"
                                />

                                <h3 className="text-sm font-semibold text-[#171511]">
                                  Endereço de entrega
                                </h3>
                              </div>

                              <div className="bg-white rounded-md border border-[#8e8980]/20 p-4">
                                {endereco.length >
                                0 ? (
                                  <div className="space-y-1 text-sm text-[#746c5c]">
                                    {endereco.map(
                                      (
                                        linha,
                                        index
                                      ) => (
                                        <p
                                          key={
                                            index
                                          }
                                        >
                                          {
                                            linha
                                          }
                                        </p>
                                      )
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-sm text-[#8e8980]">
                                    Endereço não disponível para este pedido.
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Itens */}
                            <div>
                              <h3 className="text-sm font-semibold text-[#171511] mb-3">
                                Produtos
                              </h3>

                              <div className="space-y-3">
                                {(
                                  detalhe.itens ||
                                  []
                                ).map(
                                  (
                                    item
                                  ) => (
                                    <div
                                      key={
                                        item.id
                                      }
                                      className="bg-white rounded-md border border-[#8e8980]/20 p-3 sm:p-4"
                                    >
                                      <div className="flex gap-3 sm:gap-4">
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-md bg-[#e2dacc] overflow-hidden flex items-center justify-center">
                                          {item.imagem_url ? (
                                            <img
                                              src={
                                                item.imagem_url
                                              }
                                              alt={
                                                item.produto
                                              }
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            <ImageOff
                                              size={24}
                                              className="text-[#8e8980]"
                                            />
                                          )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                          <p className="font-medium text-[#171511]">
                                            {
                                              item.produto
                                            }
                                          </p>

                                          <div className="text-sm text-[#8e8980] mt-1 space-y-0.5">
                                            <p>
                                              Tamanho:{' '}
                                              {item.tamanho ||
                                                '—'}
                                            </p>

                                            <p>
                                              Cor:{' '}
                                              {item.cor ||
                                                '—'}
                                            </p>

                                            <p>
                                              Quantidade:{' '}
                                              {
                                                item.quantidade
                                              }
                                            </p>
                                          </div>

                                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3">
                                            <p className="text-sm text-[#746c5c]">
                                              {formatCurrency(
                                                item.preco_unitario
                                              )}{' '}
                                              por unidade
                                            </p>

                                            <p className="font-semibold text-[#171511]">
                                              {formatCurrency(
                                                Number(
                                                  item.preco_unitario
                                                ) *
                                                  Number(
                                                    item.quantidade
                                                  )
                                              )}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>

                            {/* Total */}
                            <div className="border-t border-[#8e8980]/20 pt-4 flex justify-between items-center">
                              <span className="text-sm text-[#8e8980]">
                                Total do pedido
                              </span>

                              <span className="text-xl font-semibold text-[#171511]">
                                {formatCurrency(
                                  detalhe.valor_total ||
                                    0
                                )}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                );
              }
            )}
          </div>
        )}
    </section>
  );
}

export default MeusPedidos;