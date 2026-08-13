import {
  Pencil,
  Trash2,
  Tags,
} from 'lucide-react';

function TabelaTiposProdutos({
  tipos,
  onEditar,
  onExcluir,
}) {
  if (tipos.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-[#8e8980]/20 p-10 text-center">
        <Tags
          size={32}
          className="mx-auto text-[#8e8980]"
        />

        <p className="text-sm text-[#8e8980] mt-3">
          Nenhum tipo de produto cadastrado.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-[#8e8980]/20 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[#8e8980] border-b border-[#8e8980]/20">
            <th className="px-5 py-3 font-normal">
              Nome
            </th>

            <th className="px-5 py-3 font-normal">
              Ações
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#8e8980]/10">
          {tipos.map((tipo) => (
            <tr key={tipo.id}>
              <td className="px-5 py-3 text-[#171511]">
                {tipo.nome}
              </td>

              <td className="px-5 py-3">
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => onEditar(tipo)}
                    title="Editar"
                    className="text-[#8e8980] hover:text-[#171511]"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onExcluir(tipo)}
                    title="Excluir"
                    className="text-[#8e8980] hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaTiposProdutos;