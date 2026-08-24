import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import {
  listarProdutos,
  criarProduto,
  atualizarProduto,
  excluirProduto,
  reativarProduto,
  criarVariacao,
  excluirProdutoDefinitivo,
} from '../../services/product.service';

import { listarCategorias } from '../../services/category.service';
import { listarTiposProduto } from '../../services/productType.service';

import TabelaProdutos from '../components/TabelaProdutos';
import ModalProduto from '../components/ModalProduto';
import ModalVariacoesImagens from '../components/ModalVariacoesImagens';

import Button from '../../components/Button';
import Loading from '../../components/Loading';

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tiposProduto, setTiposProduto] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);

  const [modalMidiaAberto, setModalMidiaAberto] =
    useState(false);

  const [produtoMidia, setProdutoMidia] =
    useState(null);

  async function carregarDados() {
    setCarregando(true);

    try {
      const [
        dadosProdutos,
        dadosCategorias,
        dadosTiposProduto,
      ] = await Promise.all([
        listarProdutos({
          incluirInativos: true,
        }),
        listarCategorias(),
        listarTiposProduto(),
      ]);

      setProdutos(
        Array.isArray(dadosProdutos)
          ? dadosProdutos
          : []
      );

      setCategorias(
        Array.isArray(dadosCategorias)
          ? dadosCategorias
          : []
      );

      setTiposProduto(
        Array.isArray(dadosTiposProduto)
          ? dadosTiposProduto
          : []
      );
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function abrirCriar() {
    setProdutoEditando(null);
    setModalAberto(true);
  }

  function abrirEditar(produto) {
    setProdutoEditando(produto);
    setModalAberto(true);
  }

  function abrirGerenciarMidia(produto) {
    setProdutoMidia(produto);
    setModalMidiaAberto(true);
  }

  async function handleSalvar(dados) {
    try {
      setErro('');

      /*
       * EDIÇÃO
       */
      if (produtoEditando) {
        await atualizarProduto(
          produtoEditando.id,
          {
            nome: dados.nome,
            descricao: dados.descricao,
            preco: dados.preco,
            categoriaId:
              dados.categoriaId,
            tipoProdutoId:
              dados.tipoProdutoId,
            destaque:
              dados.destaque,
            promocao:
              dados.promocao,
          }
        );

        /*
         * As variações que já possuem ID
         * já existem no banco.
         *
         * Somente as novas variações,
         * sem ID, devem ser criadas.
         */
        if (
          Array.isArray(
            dados.variacoes
          )
        ) {
          const novasVariacoes =
            dados.variacoes.filter(
              (variacao) =>
                !variacao.id
            );

          for (
            const variacao of
            novasVariacoes
          ) {
            await criarVariacao(
              produtoEditando.id,
              {
                tamanho:
                  variacao.tamanho,

                cor:
                  variacao.cor ||
                  null,

                estoque:
                  Number(
                    variacao.estoque
                  ),
              }
            );
          }
        }

        setModalAberto(false);

        await carregarDados();

        return;
      }

      /*
       * CADASTRO DE NOVO PRODUTO
       */
      const produtoCriado =
        await criarProduto({
          nome: dados.nome,
          descricao:
            dados.descricao,
          preco: dados.preco,
          categoriaId:
            dados.categoriaId,
          tipoProdutoId:
            dados.tipoProdutoId,
          destaque:
            dados.destaque,
          promocao:
            dados.promocao,
        });

      /*
       * Cria todas as variações
       * do novo produto.
       */
      if (
        Array.isArray(
          dados.variacoes
        )
      ) {
        for (
          const variacao of
          dados.variacoes
        ) {
          await criarVariacao(
            produtoCriado.id,
            {
              tamanho:
                variacao.tamanho,

              cor:
                variacao.cor ||
                null,

              estoque:
                Number(
                  variacao.estoque
                ),
            }
          );
        }
      }

      setModalAberto(false);

      await carregarDados();
    } catch (error) {
      setErro(
        error.message
      );
    }
  }

  async function handleDesativar(
    produto
  ) {
    if (
      !confirm(
        `Desativar "${produto.nome}"? Ele deixará de aparecer na loja.`
      )
    ) {
      return;
    }

    try {
      await excluirProduto(
        produto.id
      );

      await carregarDados();
    } catch (error) {
      alert(
        error.message
      );
    }
  }

  async function handleReativar(
    produto
  ) {
    try {
      await reativarProduto(
        produto.id
      );

      await carregarDados();
    } catch (error) {
      alert(
        error.message
      );
    }
  }

  async function handleExcluirDefinitivo(
    produto
  ) {
    if (
      !confirm(
        `Excluir "${produto.nome}" definitivamente? Essa ação não pode ser desfeita.`
      )
    ) {
      return;
    }

    try {
      await excluirProdutoDefinitivo(
        produto.id
      );

      await carregarDados();
    } catch (error) {
      alert(
        error.message
      );
    }
  }

  if (carregando) {
    return (
      <Loading text="Carregando produtos..." />
    );
  }

  return (
    <div className="min-w-0 w-full">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-[#171511]">
            Produtos
          </h1>

          <p className="text-sm text-[#8e8980] mt-1">
            Gerencie seus produtos, variações e imagens.
          </p>
        </div>

        <Button
          onClick={abrirCriar}
          fullWidth={false}
          className="w-full sm:w-auto"
        >
          <span className="inline-flex items-center justify-center gap-2">
            <Plus size={16} />
            Novo produto
          </span>
        </Button>
      </div>

      {/* Erro */}
      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-5">
          <p className="text-sm text-red-700">
            {erro}
          </p>
        </div>
      )}

      {/* Tabela */}
      <div className="min-w-0 w-full">
        <TabelaProdutos
          produtos={produtos}
          onEditar={abrirEditar}
          onGerenciarMidia={
            abrirGerenciarMidia
          }
          onDesativar={
            handleDesativar
          }
          onReativar={
            handleReativar
          }
          onExcluirDefinitivo={
            handleExcluirDefinitivo
          }
        />
      </div>

      {/* Modal de produto */}
      <ModalProduto
        aberto={modalAberto}
        onFechar={() =>
          setModalAberto(false)
        }
        onSalvar={handleSalvar}
        produtoEditando={
          produtoEditando
        }
        categorias={
          categorias
        }
        tiposProduto={
          tiposProduto
        }
      />

      {/* Modal de variações e imagens */}
      <ModalVariacoesImagens
        aberto={
          modalMidiaAberto
        }
        onFechar={() =>
          setModalMidiaAberto(false)
        }
        produto={
          produtoMidia
        }
      />
    </div>
  );
}

export default Produtos;