import { useEffect } from 'react';
import { X } from 'lucide-react';

function Modal({
  aberto,
  onFechar,
  titulo,
  children,
  tamanho = 'md',
}) {
  useEffect(() => {
    if (!aberto) return;

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onFechar();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [aberto, onFechar]);

  if (!aberto) {
    return null;
  }

  const tamanhos = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  function handleFundoClick(event) {
    if (event.target === event.currentTarget) {
      onFechar();
    }
  }

  return (
    <div
      onClick={handleFundoClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#171511]/60 px-4"
    >
      <div
        className={`
          w-full
          ${tamanhos[tamanho]}
          bg-[#e2dacc]
          rounded-lg
          shadow-xl
          overflow-hidden
        `}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#8e8980]/30">
          <h2 className="text-lg font-semibold text-[#171511]">
            {titulo}
          </h2>

          <button
            type="button"
            onClick={onFechar}
            title="Fechar"
            className="text-[#8e8980] hover:text-[#171511] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;