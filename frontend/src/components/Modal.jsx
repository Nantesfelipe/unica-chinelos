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
    if (!aberto) {
      return;
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onFechar();
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown
      );
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
    if (
      event.target === event.currentTarget
    ) {
      onFechar();
    }
  }

  return (
    <div
      onClick={handleFundoClick}
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-[#171511]/60
        p-3 sm:p-4
      "
    >
      <div
        className={`
          w-full
          ${tamanhos[tamanho]}
          max-h-[calc(100vh-1.5rem)]
          sm:max-h-[calc(100vh-2rem)]
          bg-[#e2dacc]
          rounded-lg
          shadow-xl
          overflow-hidden
          flex flex-col
        `}
      >
        {/* Cabeçalho */}
        <div className="shrink-0 flex items-center justify-between gap-4 px-4 py-4 sm:px-6 border-b border-[#8e8980]/30">
          <h2 className="min-w-0 text-base sm:text-lg font-semibold text-[#171511] truncate">
            {titulo}
          </h2>

          <button
            type="button"
            onClick={onFechar}
            title="Fechar"
            aria-label="Fechar"
            className="shrink-0 text-[#8e8980] hover:text-[#171511] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="min-h-0 overflow-y-auto p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;