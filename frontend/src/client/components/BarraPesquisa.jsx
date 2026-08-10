import { Search } from 'lucide-react';

function BarraPesquisa({ value, onChange, placeholder = 'Buscar por nome' }) {
  return (
    <div className="flex items-center gap-2 border border-[#8e8980]/40 rounded-md px-3 py-2 max-w-xs">
      <Search size={16} className="text-[#8e8980]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="text-sm outline-none w-full bg-transparent text-[#171511]"
      />
    </div>
  );
}

export default BarraPesquisa;