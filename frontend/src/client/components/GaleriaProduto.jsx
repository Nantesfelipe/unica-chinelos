import { useState } from 'react';
import { ImageOff } from 'lucide-react';

function GaleriaProduto({ imagens = [], nome = 'Produto' }) {
  const [ativa, setAtiva] = useState(0);

  if (!imagens.length) {
    return (
      <div className="bg-[#e2dacc] rounded-lg h-[420px] flex items-center justify-center">
        <ImageOff
          size={40}
          className="text-[#8e8980]"
        />
      </div>
    );
  }

  const imagemAtual = imagens[ativa];

  return (
    <div>
      <div className="bg-[#e2dacc] rounded-lg h-[420px] overflow-hidden flex items-center justify-center">
        <img
          src={imagemAtual?.url}
          alt={`${nome} - imagem ${ativa + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {imagens.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto">
          {imagens.map((imagem, index) => (
            <button
              key={imagem.id ?? index}
              type="button"
              onClick={() => setAtiva(index)}
              className={`
                w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2
                ${
                  index === ativa
                    ? 'border-[#746c5c]'
                    : 'border-transparent'
                }
              `}
            >
              <img
                src={imagem.url}
                alt={`${nome} miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default GaleriaProduto;