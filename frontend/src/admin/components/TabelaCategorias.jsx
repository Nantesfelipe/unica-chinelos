import {
  Trash2,
  Tags,
} from 'lucide-react';

function TabelaCategorias({
  categorias,
  onExcluir,
}) {
  if (categorias.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-[#8e8980]/20 p-6 sm:p-10 text-center">
        <Tags
          size={32}
          className="mx-auto text-[#8e8980]"
        />

        <p className="text-sm text-[#8e8980] mt-3">
          Nenhuma categoria cadastrada.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-[#8e8980]/20 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-sm">
          <thead>
            <tr className="text-left text-[#8e8980] border-b border-[#8e8980]/20">
              <th className="px-5 py-3 font-normal">
                Nome
              </th>

              <th className="px-5 py-3 font-normal">
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#8e8980]/10">
            {categorias.map(
              (categoria) => (
                <tr
                  key={categoria.id}
                >
                  <td className="px-5 py-3 text-[#171511]">
                    {categoria.nome}
                  </td>

                  <td className="px-5 py-3">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          onExcluir(
                            categoria
                          )
                        }
                        title="Excluir"
                        className="text-[#8e8980] hover:text-red-700"
                      >
                        <Trash2
                          size={16}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TabelaCategorias;