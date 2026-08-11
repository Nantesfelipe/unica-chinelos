import { useEffect, useState } from 'react';
import { Plus, ImagePlus } from 'lucide-react';

import {
  listarVariacoes,
  criarVariacao,
  listarImagens,
  enviarImagens,
} from '../../services/product.service';

import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';

const VARIACAO_VAZIA = { cor: '', tamanho: '', estoque: '' };

function ModalVariacoesImagens({ aberto, onFechar, produto }) {
  const [variacoes, setVariacoes] = useState([]);
  const [imagens, setImagens] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [formVariacao, setFormVariacao] = useState(VARIACAO_VAZIA);
  const [salvandoVariacao, setSalvandoVariacao] = useState(false);

  const [arquivos, setArquivos] = useState([]);
  const [enviandoImagens, setEnviandoImagens] = useState(false);

  const [erro, setErro] = useState('');

  async function carregar() {
    if (!produto) return;

    setCarregando(true);
    try {
      const [dadosVariacoes, dadosImagens] = await Promise.all([
        listarVariacoes(produto.id),
        listarImagens(produto.id),
      ]);
      setVariacoes(Array.isArray(dadosVariacoes) ? dadosVariacoes : []);
      setImagens(Array.isArray(dadosImagens) ? dadosImagens : []);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    if (aberto) {
      setErro('');
      setFormVariacao(VARIACAO_VAZIA);
      setArquivos([]);
      carregar();
    }
  }, [aberto, produto]);

  async function handleAdicionarVariacao(event) {
    event.preventDefault();
    setErro('');

    if (!formVariacao.cor && !formVariacao.tamanho) {
      setErro('Informe cor e/ou tamanho da variação.');
      return;
    }

    setSalvandoVariacao(true);
    try {
      await criarVariacao(produto.id, {
        cor: formVariacao.cor,
        tamanho: formVariacao.tamanho,
        estoque: Number(formVariacao.estoque) || 0,
      });
      setFormVariacao(VARIACAO_VAZIA);
      await carregar();
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvandoVariacao(false);
    }
  }

  async function handleEnviarImagens() {
    if (arquivos.length === 0) return;

    setErro('');
    setEnviandoImagens(true);

    try {
      await enviarImagens(produto.id, arquivos);
      setArquivos([]);
      await carregar();
    } catch (error) {
      setErro(error.message);
    } finally {
      setEnviandoImagens(false);
    }
  }

  if (!produto) return null;

  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      titulo={`Variações e imagens — ${produto.nome}`}
      tamanho="lg"
    >
      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-5">
          <p className="text-sm text-red-700">{erro}</p>
        </div>
      )}

      {/* Variações */}
      <div className="mb-8">
        <h3 className="font-medium text-[#171511] mb-3">Variações</h3>

        {carregando ? (
          <p className="text-sm text-[#8e8980]">Carregando...</p>
        ) : variacoes.length === 0 ? (
          <p className="text-sm text-[#8e8980] mb-4">Nenhuma variação cadastrada ainda.</p>
        ) : (
          <div className="flex flex-wrap gap-2 mb-4">
            {variacoes.map((v) => (
              <span
                key={v.id}
                className="border border-[#8e8980]/40 rounded-md px-3 py-1.5 text-sm text-[#171511]"
              >
                {[v.cor, v.tamanho].filter(Boolean).join(' · ')} — estoque: {v.estoque}
              </span>
            ))}
          </div>
        )}

        <form onSubmit={handleAdicionarVariacao} className="grid grid-cols-3 gap-3 items-end">
          <Input
            label="Cor"
            name="cor"
            value={formVariacao.cor}
            onChange={(e) => setFormVariacao((f) => ({ ...f, cor: e.target.value }))}
          />
          <Input
            label="Tamanho"
            name="tamanho"
            value={formVariacao.tamanho}
            onChange={(e) => setFormVariacao((f) => ({ ...f, tamanho: e.target.value }))}
          />
          <Input
            label="Estoque"
            name="estoque"
            type="number"
            value={formVariacao.estoque}
            onChange={(e) => setFormVariacao((f) => ({ ...f, estoque: e.target.value }))}
          />

          <div className="col-span-3">
            <Button type="submit" fullWidth={false} disabled={salvandoVariacao}>
              <span className="inline-flex items-center gap-2">
                <Plus size={16} />
                {salvandoVariacao ? 'Adicionando...' : 'Adicionar variação'}
              </span>
            </Button>
          </div>
        </form>
      </div>

      {/* Imagens */}
      <div>
        <h3 className="font-medium text-[#171511] mb-3">Imagens</h3>

        {!carregando && imagens.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {imagens.map((img) => (
              <img
                key={img.id}
                src={img.url}
                alt=""
                className="w-16 h-16 rounded-md object-cover border border-[#8e8980]/30"
              />
            ))}
          </div>
        )}

       <div className="flex items-center gap-3">
  <input
    type="file"
    accept="image/*"
    multiple
    onChange={(e) => setArquivos(Array.from(e.target.files))}
    className="
      text-sm text-[#8e8980]
      file:mr-3 file:px-4 file:py-2
      file:rounded-md file:border-0
      file:bg-[#171511] file:text-[#e2dacc]
      file:text-sm file:font-medium
      file:cursor-pointer
      cursor-pointer
    "
  />

  <Button
    type="button"
    fullWidth={false}
    onClick={handleEnviarImagens}
    disabled={arquivos.length === 0 || enviandoImagens}
  >
    <span className="inline-flex items-center gap-2">
      <ImagePlus size={16} />
      {enviandoImagens ? 'Enviando...' : 'Enviar'}
    </span>
  </Button>
</div>
      </div>
    </Modal>
  );
}

export default ModalVariacoesImagens;