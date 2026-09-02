import { Link } from 'react-router-dom';

function PedidoErro() {
  return (
    <section className="max-w-2xl mx-auto px-6 py-20 text-center">
      <h1 className="text-2xl font-semibold text-[#171511]">
        Não foi possível concluir o pagamento
      </h1>
      <p className="text-[#746c5c] mt-3">
        Verifique os dados do cartão ou tente outro meio de pagamento.
      </p>
      <Link to="/checkout" className="inline-block mt-6 text-[#171511] underline">
        Tentar novamente
      </Link>
    </section>
  );
}

export default PedidoErro;