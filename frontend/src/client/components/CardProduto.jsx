import { Link } from 'react-router-dom';
import { ImageOff } from 'lucide-react';

import formatCurrency from '../../utils/formatCurrency';

function CardProduto({ produto }) {
  const imagem =
    produto?.imagem ||
    produto?.imagem_url ||
    produto?.imagemUrl ||
    produto?.imagens?.[0]?.url;

  return (
    <Link
      to={`/produto/${produto.id}`}
      className="group block bg-white border border-[#8e8980]/25 rounded-lg overflow-hidden hover:border-[#746c5c] transition-colors"
    >
      <div className="relative h-64 bg-[#e2dacc] overflow-hidden flex items-center justify-center">
        {imagem ? (
          <img
            src={imagem}
            alt={produto.nome}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <ImageOff
            size={30}
            className="text-[#8e8980]"
          />
        )}

        {produto?.promocao && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#b94618] text-[#e2dacc] text-xs font-semibold uppercase tracking-wide shadow-sm">
            Promoção
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-sm text-[#171511] line-clamp-2 min-h-10">
          {produto.nome}
        </p>

        <p className="text-base font-semibold text-[#171511] mt-2">
          {formatCurrency(produto.preco)}
        </p>
      </div>
    </Link>
  );
}

export default CardProduto;