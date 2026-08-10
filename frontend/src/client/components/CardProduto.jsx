import { Link } from 'react-router-dom';

function CardProduto({ produto }) {
  return (
    <Link
      to={`/produto/${produto.id}`}
      className="border border-[#8e8980]/30 rounded-lg overflow-hidden block hover:border-[#746c5c] transition-colors"
    >
      <div className="bg-[#e2dacc] h-28" />
      <div className="p-3">
        <p className="text-sm text-[#171511]">{produto.nome}</p>
        <p className="text-sm font-semibold text-[#171511]">
          R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
        </p>
      </div>
    </Link>
  );
}

export default CardProduto;