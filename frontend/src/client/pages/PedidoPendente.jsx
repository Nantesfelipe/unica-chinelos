import { Link, useLocation } from 'react-router-dom';

function PedidoPendente() {
  const { state } = useLocation();
  const pontoDeInteracao = state?.pontoDeInteracao;
  const qrCodeBase64 =
    pontoDeInteracao?.transaction_data?.qr_code_base64;
  const linkBoleto =
    pontoDeInteracao?.transaction_data?.ticket_url;

  return (
    <section className="max-w-2xl mx-auto px-6 py-20 text-center">
      <h1 className="text-2xl font-semibold text-[#171511]">
        Pagamento em análise
      </h1>
      <p className="text-[#746c5c] mt-3">
        Assim que for confirmado, você recebe um e-mail e pode acompanhar em
        "Meus Pedidos".
      </p>

      {qrCodeBase64 && (
        <img
          src={`data:image/png;base64,${qrCodeBase64}`}
          alt="QR Code Pix"
          className="mx-auto mt-6 w-52 h-52"
        />
      )}

    {linkBoleto && (
  <a
    href={linkBoleto}
    target="_blank"
    rel="noreferrer"
    className="inline-block mt-6 text-[#171511] underline"
  >
    Ver boleto
  </a>
)}

      <Link to="/pedidos" className="block mt-6 text-[#746c5c] underline">
        Ver meus pedidos
      </Link>
    </section>
  );
}

export default PedidoPendente;