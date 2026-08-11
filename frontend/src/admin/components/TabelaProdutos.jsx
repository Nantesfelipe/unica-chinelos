import { Pencil, Trash2, Package, Images, RotateCcw, X } from 'lucide-react';

import formatCurrency from '../../utils/formatCurrency';

function TabelaProdutos({ produtos, onEditar, onGerenciarMidia, onDesativar, onReativar, onExcluirDefinitivo }) {
  if (produtos.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-[#8e8980]/20 p-10 text-center">
        <Package size={32} className="mx-auto text-[#8e8980]" />
        <p className="text-sm text-[#8e8980] mt-3">Nenhum produto cadastrado.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-[#8e8980]/20 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[#8e8980] border-b border-[#8e8980]/20">
            <th className="px-5 py-3 font-normal">Produto</th>
            <th className="px-5 py-3 font-normal">Preço</th>
            <th className="px-5 py-3 font-normal">Status</th>
            <th className="px-5 py-3 font-normal"></th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#8e8980]/10">
          {produtos.map((produto) => (
            <tr key={produto.id} className={!produto.ativo ? 'opacity-50' : ''}>
              <td className="px-5 py-3 text-[#171511]">{produto.nome}</td>
              <td className="px-5 py-3 text-[#171511]">{formatCurrency(produto.preco)}</td>
              <td className="px-5 py-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    produto.ativo
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {produto.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => onGerenciarMidia(produto)}
                    title="Variações e imagens"
                    className="text-[#746c5c] hover:text-[#171511]"
                  >
                    <Images size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onEditar(produto)}
                    title="Editar"
                    className="text-[#746c5c] hover:text-[#171511]"
                  >
                    <Pencil size={16} />
                  </button>

                  {produto.ativo ? (
                    <button
                      type="button"
                      onClick={() => onDesativar(produto)}
                      title="Desativar"
                      className="text-[#8e8980] hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => onReativar(produto)}
                        title="Reativar"
                        className="text-[#8e8980] hover:text-green-700"
                      >
                        <RotateCcw size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onExcluirDefinitivo(produto)}
                        title="Excluir definitivamente"
                        className="text-[#8e8980] hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaProdutos;