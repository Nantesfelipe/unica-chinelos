import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import {
  listarTiposProduto,
  criarTipoProduto,
  atualizarTipoProduto,
  excluirTipoProduto,
} from '../../services/productType.service';

import TabelaTiposProdutos from '../components/TabelaTiposProdutos';

import Input from '../../components/Input';
import Button from '../../components/Button';

function TiposProdutos() {
  const [tipos, setTipos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [erro, setErro] = useState('');
  const [nome, setNome] = useState('');

  const [tipoEditando, setTipoEditando] = useState(null);
  const [salvando, setSalvando] = useState(false);

  async function carregarTipos() {
    setCarregando(true);

    try {
      const dados = await listarTiposProduto();

      setTipos(
        Array.isArray(dados)
          ? dados
          : []
      );
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarTipos();
  }, []);

  function iniciarNovo() {
    setTipoEditando(null);
    setNome('');
    setErro('');
  }

  function iniciarEdicao(tipo) {
    setTipoEditando(tipo);
    setNome(tipo.nome);
    setErro('');
  }

  async function handleSalvar(event) {
    event.preventDefault();

    setErro('');

    const nomeLimpo = nome.trim();

    if (!nomeLimpo) {
      setErro(
        'Digite um nome para o tipo de produto.'
      );
      return;
    }

    setSalvando(true);

    try {
      if (tipoEditando) {
        await atualizarTipoProduto(
          tipoEditando.id,
          {
            nome: nomeLimpo,
          }
        );
      } else {
        await criarTipoProduto({
          nome: nomeLimpo,
        });
      }

      setNome('');
      setTipoEditando(null);

      await carregarTipos();
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir(tipo) {
    const confirmar = confirm(
      `Excluir "${tipo.nome}"?`
    );

    if (!confirmar) {
      return;
    }

    setErro('');

    try {
      await excluirTipoProduto(tipo.id);

      if (tipoEditando?.id === tipo.id) {
        setTipoEditando(null);
        setNome('');
      }

      await carregarTipos();
    } catch (error) {
      setErro(error.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#171511]">
            Tipos de produtos
          </h1>

          <p className="text-sm text-[#8e8980] mt-1">
            Cadastre, edite e exclua os tipos de
            produtos da loja.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSalvar}
        className="bg-white border border-[#8e8980]/20 rounded-lg p-5 mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 max-w-2xl">
          <div className="flex-1">
            <Input
              label={
                tipoEditando
                  ? 'Editar tipo de produto'
                  : 'Novo tipo de produto'
              }
              name="nome"
              value={nome}
              onChange={(event) =>
                setNome(event.target.value)
              }
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              fullWidth={false}
              disabled={salvando}
            >
              <span className="inline-flex items-center gap-2">
                <Plus size={16} />

                {tipoEditando
                  ? 'Salvar alteração'
                  : 'Adicionar'}
              </span>
            </Button>

            {tipoEditando && (
              <Button
                type="button"
                fullWidth={false}
                disabled={salvando}
                onClick={iniciarNovo}
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </form>

      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-5">
          <p className="text-sm text-red-700">
            {erro}
          </p>
        </div>
      )}

      {carregando ? (
        <p className="text-sm text-[#8e8980]">
          Carregando...
        </p>
      ) : (
        <TabelaTiposProdutos
          tipos={tipos}
          onEditar={iniciarEdicao}
          onExcluir={handleExcluir}
        />
      )}
    </div>
  );
}

export default TiposProdutos;