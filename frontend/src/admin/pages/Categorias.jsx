import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import {
  listarCategorias,
  criarCategoria,
  excluirCategoria,
} from '../../services/category.service';

import TabelaCategorias from '../components/TabelaCategorias';
import Input from '../../components/Input';
import Button from '../../components/Button';

function Categorias() {
  const [categorias, setCategorias] =
    useState([]);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState('');

  const [nomeNovo, setNomeNovo] =
    useState('');

  const [salvando, setSalvando] =
    useState(false);

  async function carregarCategorias() {
    setCarregando(true);

    try {
      const dados =
        await listarCategorias();

      setCategorias(
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
    carregarCategorias();
  }, []);

  async function handleCriar(event) {
    event.preventDefault();
    setErro('');

    if (!nomeNovo.trim()) {
      setErro(
        'Digite um nome para a categoria.'
      );
      return;
    }

    setSalvando(true);

    try {
      await criarCategoria({
        nome: nomeNovo.trim(),
      });

      setNomeNovo('');

      await carregarCategorias();
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir(
    categoria
  ) {
    if (
      !confirm(
        `Excluir "${categoria.nome}"? Produtos vinculados a ela podem ficar inconsistentes.`
      )
    ) {
      return;
    }

    try {
      await excluirCategoria(
        categoria.id
      );

      await carregarCategorias();
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="min-w-0">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#171511]">
          Categorias
        </h1>

        <p className="text-sm text-[#8e8980] mt-1">
          Gerencie as categorias dos produtos.
        </p>
      </div>

      <form
        onSubmit={handleCriar}
        className="flex flex-col sm:flex-row sm:items-end gap-3 mb-6 w-full max-w-xl"
      >
        <div className="flex-1 min-w-0">
          <Input
            label="Nova categoria"
            name="nome"
            value={nomeNovo}
            onChange={(e) =>
              setNomeNovo(
                e.target.value
              )
            }
          />
        </div>

        <Button
          type="submit"
          fullWidth={false}
          disabled={salvando}
          className="w-full sm:w-auto"
        >
          <span className="inline-flex items-center justify-center gap-2">
            <Plus size={16} />
            Adicionar
          </span>
        </Button>
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
        <TabelaCategorias
          categorias={categorias}
          onExcluir={handleExcluir}
        />
      )}
    </div>
  );
}

export default Categorias;