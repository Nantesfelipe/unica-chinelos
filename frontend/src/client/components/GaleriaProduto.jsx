import { useState } from 'react';

function GaleriaProduto({ imagens = [] }) {
  const [ativa, setAtiva] = useState(0);

  if (imagens.length === 0) {
    return <div className="bg-[#e2dacc] rounded-lg h-64" />;
  }

  return (
    <div>
      <div className="bg-[#e2dacc] rounded-lg h-64 mb-3 overflow-hidden">
        <img
          src={imagens[ativa].url}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex gap-2">
        {imagens.map((img, index) => (
          <button
            key={img.id}
            onClick={() => setAtiva(index)}
            className={`w-14 h-14 rounded overflow-hidden border-2 ${
              index === ativa ? 'border-[#746c5c]' : 'border-transparent'
            }`}
          >
            <img src={img.url} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default GaleriaProduto;