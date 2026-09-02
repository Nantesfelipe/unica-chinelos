import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';

function PedidoSucesso() {
  const { limparCarrinho } = useCart();

  useEffect(() => {
    limparCarrinho();
  }, []);

  return (
    <section className="max-w-2xl mx-auto px-6 py-20 text-center">
      <h1 className="text-2xl font-semibold text-[#171511]">
        Pagamento aprovado!
      </h1>
      <p className="text-[#746c5c] mt-3">
        Seu pedido foi confirmado e já está sendo preparado.
      </p>
      <Link to="/pedidos" className="inline-block mt-6 text-[#171511] underline">
        Ver meus pedidos
      </Link>
    </section>
  );
}

export default PedidoSucesso;