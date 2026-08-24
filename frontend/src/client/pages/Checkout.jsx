import { useState } from 'react';
import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  MapPin,
} from 'lucide-react';

import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';

import {
  finalizarPedido,
} from '../../services/order.service';

import Button from '../../components/Button';
import Loading from '../../components/Loading';

import formatCurrency from '../../utils/formatCurrency';

function Checkout() {
  const navigate =
    useNavigate();

  const {
    usuario,
    autenticado,
  } = useAuth();

  const {
    carrinho,
    totalCarrinho,
  } = useCart();

  const [
    carregando,
    setCarregando,
  ] = useState(false);

  const [
    erro,
    setErro,
  ] = useState('');

  function perfilTemEndereco() {
    if (!usuario) {
      return false;
    }

    const camposObrigatorios = [
      'cep',
      'logradouro',
      'numero',
      'bairro',
      'cidade',
      'estado',
    ];

    return camposObrigatorios.every(
      (campo) => {
        const valor =
          usuario[campo];

        return (
          valor !== null &&
          valor !== undefined &&
          String(valor).trim() !== ''
        );
      }
    );
  }

  async function handleFinalizar() {
    if (!autenticado) {
      navigate('/login');
      return;
    }

    if (!perfilTemEndereco()) {
      setErro(
        'Complete seu endereço no perfil antes de finalizar o pedido.'
      );

      return;
    }

    if (
      !carrinho ||
      carrinho.length === 0
    ) {
      setErro(
        'Seu carrinho está vazio.'
      );

      return;
    }

    setErro('');
    setCarregando(true);

    try {
      const itens =
        carrinho.map(
          (item) => ({
            variacaoId:
              item.variacaoId,

            quantidade:
              item.quantidade,
          })
        );

      const resposta =
        await finalizarPedido({
          itens,

          /*
           * Mantido temporariamente para
           * compatibilidade com a estrutura
           * atual do banco.
           *
           * O método real de pagamento será
           * definido pelo Mercado Pago.
           */
          formaPagamento: 'pix',
        });

      if (
        !resposta ||
        !resposta.initPoint
      ) {
        throw new Error(
          'Não foi possível iniciar o pagamento.'
        );
      }

      /*
       * O carrinho NÃO é limpo aqui.
       *
       * Vamos limpar somente quando tivermos
       * o retorno adequado do pagamento.
       */
      window.location.href =
        resposta.initPoint;
    } catch (error) {
      setErro(
        error.message ||
          'Não foi possível iniciar o pagamento.'
      );

      setCarregando(false);
    }
  }

  if (
    !carrinho ||
    carrinho.length === 0
  ) {
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
        <Loading text="Preparando pagamento..." />
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
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

      {autenticado &&
        !perfilTemEndereco() && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-6">
            <div className="flex items-start gap-3">
              <MapPin
                size={20}
                className="text-amber-600 shrink-0 mt-0.5"
              />

              <div>
                <p className="text-sm font-medium text-amber-900">
                  Endereço de entrega incompleto
                </p>

                <p className="text-sm text-amber-800 mt-1">
                  Complete seu endereço antes de finalizar o pedido.
                </p>

                <Link
                  to="/perfil"
                  className="inline-block mt-3 text-sm font-medium text-amber-900 underline"
                >
                  Completar endereço
                </Link>
              </div>
            </div>
          </div>
        )}

      {autenticado &&
        perfilTemEndereco() && (
          <div className="bg-white rounded-lg p-5 sm:p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin
                size={19}
                className="text-[#746c5c]"
              />

              <h2 className="font-semibold text-[#171511]">
                Endereço de entrega
              </h2>
            </div>

            <div className="text-sm text-[#746c5c] space-y-1">
              <p className="text-[#171511] font-medium">
                {usuario.logradouro},{' '}
                {usuario.numero}
              </p>

              {usuario.complemento && (
                <p>
                  {usuario.complemento}
                </p>
              )}

              <p>
                {usuario.bairro}
              </p>

              <p>
                {usuario.cidade} -{' '}
                {usuario.estado}
              </p>

              <p>
                CEP: {usuario.cep}
              </p>
            </div>

            <Link
              to="/perfil"
              className="inline-block mt-4 text-sm text-[#746c5c] hover:text-[#171511]"
            >
              Alterar endereço
            </Link>
          </div>
        )}

      <div className="bg-white rounded-lg p-5 sm:p-6">
        <h2 className="font-semibold text-[#171511]">
          Resumo do pedido
        </h2>

        <div className="mt-5 space-y-4">
          {carrinho.map(
            (item) => (
              <div
                key={item.id}
                className="flex justify-between gap-4 text-sm"
              >
                <span className="text-[#746c5c]">
                  {item.nome}

                  {(item.cor ||
                    item.tamanho) && (
                    <span className="text-[#8e8980]">
                      {' '}
                      (
                      {[
                        item.cor,
                        item.tamanho,
                      ]
                        .filter(
                          Boolean
                        )
                        .join(
                          ' · '
                        )}
                      )
                    </span>
                  )}

                  {' '}×{' '}
                  {item.quantidade}
                </span>

                <span className="text-[#171511] font-medium whitespace-nowrap">
                  {formatCurrency(
                    Number(
                      item.preco
                    ) *
                      item.quantidade
                  )}
                </span>
              </div>
            )
          )}
        </div>

        <div className="border-t border-[#8e8980]/20 mt-6 pt-5 flex justify-between">
          <span className="font-semibold text-[#171511]">
            Total
          </span>

          <span className="font-semibold text-[#171511]">
            {formatCurrency(
              totalCarrinho
            )}
          </span>
        </div>

        {erro && (
          <p className="text-sm text-red-700 mt-5">
            {erro}
          </p>
        )}

        <div className="mt-6">
          <Button
            onClick={
              handleFinalizar
            }
            disabled={
              !autenticado ||
              !perfilTemEndereco()
            }
          >
            Ir para pagamento
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Checkout;