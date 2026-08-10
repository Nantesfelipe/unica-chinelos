import { Heart } from 'lucide-react';

function BotaoFavorito({
  favoritado = false,
  onToggle,
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={
        favoritado
          ? 'Remover dos favoritos'
          : 'Adicionar aos favoritos'
      }
      className="border border-[#8e8980]/40 rounded-md p-2.5 hover:border-[#746c5c] transition-colors"
    >
      <Heart
        size={19}
        className={
          favoritado
            ? 'fill-[#746c5c] text-[#746c5c]'
            : 'text-[#8e8980]'
        }
      />
    </button>
  );
}

export default BotaoFavorito;