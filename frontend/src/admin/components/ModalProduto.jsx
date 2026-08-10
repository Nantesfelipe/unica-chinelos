import { useEffect, useState } from 'react';

import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';

const FORM_VAZIO = {
  nome: '',
  descricao: '',
  preco: '',
  categoriaId: '',
  destaque: false,
  promocao: false,
};

function ModalProduto({ aberto, onFechar, onSalvar, produtoEditando, categorias }) {
  const [form, setForm] = useState(FORM_VAZIO);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (produtoEditando) {
      setForm({
        nome: produtoEditando.nome || '',
        descricao: produtoEditando.descricao || '',
        preco: produtoEditando.preco || '',
        categoriaId: produtoEditando.categoria_id || '',
        destaque: !!produtoEditando.destaque,
        promocao: !!produtoEditando.promocao,
      });
    } else {
      setForm(FORM_VAZIO);
    }
    setErro('');
  }, [produtoEditando, aberto]);

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErro('');

    if (!form.nome.trim() || !form.preco || !form.categoriaId) {
      setErro('Nome, preço e categoria são obrigatórios.');
      return;
    }

    setSalvando(true);

    try {
      await onSalvar({
        nome: form.nome.trim(),
        descricao: form.descricao.trim(),
        preco: Number(form.preco),
        categoriaId: Number(form.categoriaId),
        destaque: form.destaque,
        promocao: form.promocao,
      });
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      titulo={produtoEditando ? 'Editar produto' : 'Novo produto'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3">
            <p className="text-sm text-red-700">{erro}</p>
          </div>
        )}

        <Input
          label="Nome"
          name="nome"
          value={form.nome}
          onChange={(e) => atualizarCampo('nome', e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium text-[#171511] mb-2">Descrição</label>
          <textarea
            value={form.descricao}
            onChange={(e) => atualizarCampo('descricao', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-md border border-[#8e8980]/40 bg-white text-[#171511] outline-none focus:border-[#746c5c]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Preço"
            name="preco"
            type="number"
            step="0.01"
            value={form.preco}
            onChange={(e) => atualizarCampo('preco', e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-[#171511] mb-2">Categoria</label>
            <select
              value={form.categoriaId}
              onChange={(e) => atualizarCampo('categoriaId', e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-[#8e8980]/40 bg-white text-[#171511] outline-none focus:border-[#746c5c]"
            >
              <option value="">Selecione</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-[#171511]">
            <input
              type="checkbox"
              checked={form.destaque}
              onChange={(e) => atualizarCampo('destaque', e.target.checked)}
            />
            Destaque
          </label>

          <label className="flex items-center gap-2 text-sm text-[#171511]">
            <input
              type="checkbox"
              checked={form.promocao}
              onChange={(e) => atualizarCampo('promocao', e.target.checked)}
            />
            Promoção
          </label>
        </div>

        <Button type="submit" disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar produto'}
        </Button>
      </form>
    </Modal>
  );
}

export default ModalProduto;