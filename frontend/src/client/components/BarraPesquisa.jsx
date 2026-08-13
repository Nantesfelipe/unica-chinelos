import { Search, X } from 'lucide-react';

function BarraPesquisa({
  value = '',
  onChange,
  onSubmit,
  placeholder = 'Buscar por nome ou cor',
}) {
  function limpar() {
    onChange('');

    if (onSubmit) {
      onSubmit();
    }
  }

  function enviarBusca(event) {
    event.preventDefault();

    if (onSubmit) {
      onSubmit();
    }
  }

  return (
    <form
      onSubmit={enviarBusca}
      className="flex items-center gap-3 border border-[#8e8980]/40 rounded-md px-3 py-2.5 bg-white w-full max-w-sm"
    >
      <Search
        size={17}
        className="text-[#8e8980] flex-shrink-0"
      />

      <input
        type="text"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="text-sm outline-none w-full bg-transparent text-[#171511] placeholder-[#8e8980]"
      />

      {value && (
        <button
          type="button"
          onClick={limpar}
          title="Limpar busca"
          className="text-[#8e8980] hover:text-[#171511]"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
}

export default BarraPesquisa;