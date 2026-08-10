import {
  Minus,
  Plus,
  Trash2,
  ImageOff,
} from 'lucide-react';

import formatCurrency from '../../utils/formatCurrency';

function ItemCarrinho({
  item,
  onAumentar,
  onDiminuir,
  onRemover,
}) {
  const imagem =
    item?.imagem ||
    item?.imagem_url ||
    item?.imagemUrl ||
    item?.imagens?.[0]?.url;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-[#8e8980]/20 pb-5 mb-5">

      <div className="bg-[#e2dacc] rounded-md w-20 h-20 flex-shrink-0 overflow-hidden flex items-center justify-center">
        {imagem ? (
          <img
            src={imagem}
            alt={item.nome}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageOff
            size={24}
            className="text-[#8e8980]"
          />
        )}
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium text-[#171511]">
          {item.nome}
        </p>

        {(item.cor || item.tamanho) && (
          <p className="text-xs text-[#8e8980] mt-1">
            {item.cor && `Cor: ${item.cor}`}
            {item.cor && item.tamanho && ' · '}
            {item.tamanho && `Tam: ${item.tamanho}`}
          </p>
        )}

        <p className="text-sm text-[#746c5c] mt-2">
          {formatCurrency(item.preco)}
        </p>
      </div>

      <div className="flex items-center gap-3 border border-[#8e8980]/40 rounded-md px-2 py-1.5">
        <button
          type="button"
          onClick={onDiminuir}
          title="Diminuir quantidade"
          className="text-[#746c5c] hover:text-[#171511]"
        >
          <Minus size={15} />
        </button>

        <span className="text-sm text-[#171511] min-w-5 text-center">
          {item.quantidade}
        </span>

        <button
          type="button"
          onClick={onAumentar}
          title="Aumentar quantidade"
          className="text-[#746c5c] hover:text-[#171511]"
        >
          <Plus size={15} />
        </button>
      </div>

      <p className="text-sm font-semibold text-[#171511] sm:w-24 sm:text-right">
        {formatCurrency(
          Number(item.preco) * item.quantidade
        )}
      </p>

      <button
        type="button"
        onClick={onRemover}
        title="Remover produto"
        className="text-[#8e8980] hover:text-red-700"
      >
        <Trash2 size={17} />
      </button>
    </div>
  );
}

export default ItemCarrinho;