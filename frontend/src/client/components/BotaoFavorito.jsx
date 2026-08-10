import { Heart } from 'lucide-react';

function BotaoFavorito({ favoritado, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="border border-[#8e8980]/40 rounded-md p-2 hover:border-[#746c5c] transition-colors"
    >
      <Heart
        size={18}
        className={favoritado ? 'fill-[#746c5c] text-[#746c5c]' : 'text-[#8e8980]'}
      />
    </button>
  );
}

export default BotaoFavorito;