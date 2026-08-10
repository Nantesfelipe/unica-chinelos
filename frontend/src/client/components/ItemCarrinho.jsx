import { Minus, Plus, Trash2 } from 'lucide-react';

function ItemCarrinho({ item, onAumentar, onDiminuir, onRemover }) {
  return (
    <div className="flex items-center gap-4 border-b border-[#8e8980]/20 pb-4 mb-4">
      <div className="bg-[#e2dacc] rounded-md w-16 h-16 flex-shrink-0" />

      <div className="flex-1">
        <p className="text-sm text-[#171511]">{item.nome}</p>
        <p className="text-xs text-[#8e8980]">Cor: {item.cor} · Tam: {item.tamanho}</p>
      </div>

      <div className="flex items-center gap-2 border border-[#8e8980]/40 rounded-md px-2 py-1">
        <button onClick={onDiminuir}><Minus size={14} className="text-[#746c5c]" /></button>
        <span className="text-sm text-[#171511]">{item.quantidade}</span>
        <button onClick={onAumentar}><Plus size={14} className="text-[#746c5c]" /></button>
      </div>

      <p className="text-sm font-semibold text-[#171511] w-20 text-right">
        R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
      </p>

      <button onClick={onRemover}>
        <Trash2 size={16} className="text-[#8e8980]" />
      </button>
    </div>
  );
}

export default ItemCarrinho;