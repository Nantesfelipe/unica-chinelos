import { useEffect, useState } from 'react';

import {
  listarVariacoes,
  criarVariacao,
} from '../../services/product.service';

import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';

const FORM_VAZIO = {
  nome: '',
  descricao: '',
  preco: '',
  categoriaId: '',
  tipoProdutoId: '',
  destaque: false,
  promocao: false,
  variacoes: [],
};

const VARIACAO_VAZIA = {
  tamanho: '',
  cor: '',
  estoque: '',
};

function ModalProduto({
  aberto,
  onFechar,
  onSalvar,
  produtoEditando,
  categorias,
  tiposProduto,
}) {
  const [form, setForm] =
    useState(FORM_VAZIO);

  const [erro, setErro] =
    useState('');

  const [salvando, setSalvando] =
    useState(false);

  const [
    carregandoVariacoes,
    setCarregandoVariacoes,
  ] = useState(false);

  useEffect(() => {
    async function prepararFormulario() {
      if (!aberto) {
        return;
      }

      setErro('');

      if (!produtoEditando) {
        setForm(FORM_VAZIO);
        return;
      }

      setCarregandoVariacoes(true);

      try {
        const variacoes =
          await listarVariacoes(
            produtoEditando.id
          );

        setForm({
          nome:
            produtoEditando.nome || '',

          descricao:
            produtoEditando.descricao || '',

          preco:
            produtoEditando.preco || '',

          categoriaId:
            produtoEditando.categoria_id ||
            '',

          tipoProdutoId:
            produtoEditando.tipo_produto_id ||
            '',

          destaque:
            !!produtoEditando.destaque,

          promocao:
            !!produtoEditando.promocao,

          variacoes:
            Array.isArray(variacoes)
              ? variacoes.map(
                  (variacao) => ({
                    id:
                      variacao.id,

                    tamanho:
                      variacao.tamanho ||
                      '',

                    cor:
                      variacao.cor || '',

                    estoque:
                      variacao.estoque ??
                      '',
                  })
                )
              : [],
        });
      } catch (error) {
        setErro(
          error.message
        );

        setForm({
          nome:
            produtoEditando.nome || '',

          descricao:
            produtoEditando.descricao || '',

          preco:
            produtoEditando.preco || '',

          categoriaId:
            produtoEditando.categoria_id ||
            '',

          tipoProdutoId:
            produtoEditando.tipo_produto_id ||
            '',

          destaque:
            !!produtoEditando.destaque,

          promocao:
            !!produtoEditando.promocao,

          variacoes: [],
        });
      } finally {
        setCarregandoVariacoes(
          false
        );
      }
    }

    prepararFormulario();
  }, [
    produtoEditando,
    aberto,
  ]);

  function atualizarCampo(
    campo,
    valor
  ) {
    setForm((atual) => ({
      ...atual,
      [campo]: valor,
    }));

    setErro('');
  }

  function adicionarVariacao() {
    setForm((atual) => ({
      ...atual,

      variacoes: [
        ...atual.variacoes,
        {
          ...VARIACAO_VAZIA,
        },
      ],
    }));

    setErro('');
  }

  function removerVariacao(index) {
    setForm((atual) => ({
      ...atual,

      variacoes:
        atual.variacoes.filter(
          (_, i) =>
            i !== index
        ),
    }));

    setErro('');
  }

  function atualizarVariacao(
    index,
    campo,
    valor
  ) {
    setForm((atual) => ({
      ...atual,

      variacoes:
        atual.variacoes.map(
          (variacao, i) =>
            i === index
              ? {
                  ...variacao,
                  [campo]: valor,
                }
              : variacao
        ),
    }));

    setErro('');
  }

  function tipoEhCalcado() {
    const tipoSelecionado =
      tiposProduto.find(
        (tipo) =>
          Number(tipo.id) ===
          Number(form.tipoProdutoId)
      );

    const nome =
      tipoSelecionado?.nome
        ?.trim()
        .toLowerCase();

    return (
      nome === 'calçado' ||
      nome === 'calçados' ||
      nome === 'calcado' ||
      nome === 'calcados'
    );
  }

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    setErro('');

    if (
      !form.nome.trim() ||
      !form.preco ||
      !form.categoriaId ||
      !form.tipoProdutoId
    ) {
      setErro(
        'Nome, preço, categoria e tipo de produto são obrigatórios.'
      );

      return;
    }

    const ehCalcado =
      tipoEhCalcado();

    if (ehCalcado) {
      for (
        const variacao
        of form.variacoes
      ) {
        if (
          !variacao.tamanho.trim()
        ) {
          setErro(
            'Informe o tamanho de todas as variações.'
          );

          return;
        }

        const estoque =
          Number(
            variacao.estoque
          );

        if (
          !Number.isInteger(
            estoque
          ) ||
          estoque < 0
        ) {
          setErro(
            'O estoque deve ser um número inteiro maior ou igual a zero.'
          );

          return;
        }
      }
    }

    setSalvando(true);

    try {
      await onSalvar({
        nome:
          form.nome.trim(),

        descricao:
          form.descricao.trim(),

        preco:
          Number(form.preco),

        categoriaId:
          Number(
            form.categoriaId
          ),

        tipoProdutoId:
          Number(
            form.tipoProdutoId
          ),

        destaque:
          form.destaque,

        promocao:
          form.promocao,

        variacoes:
          ehCalcado
            ? form.variacoes.map(
                (variacao) => ({
                  id:
                    variacao.id,

                  tamanho:
                    variacao.tamanho.trim(),

                  cor:
                    variacao.cor.trim() ||
                    null,

                  estoque:
                    Number(
                      variacao.estoque
                    ),
                })
              )
            : [],
      });
    } catch (error) {
      setErro(
        error.message
      );
    } finally {
      setSalvando(false);
    }
  }

  if (
    !aberto
  ) {
    return null;
  }

  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      titulo={
        produtoEditando
          ? 'Editar produto'
          : 'Novo produto'
      }
    >
      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-4"
      >
        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3">
            <p className="text-sm text-red-700">
              {erro}
            </p>
          </div>
        )}

        <Input
          label="Nome"
          name="nome"
          value={form.nome}
          onChange={(e) =>
            atualizarCampo(
              'nome',
              e.target.value
            )
          }
          required
        />

        <div>
          <label className="block text-sm font-medium text-[#171511] mb-2">
            Descrição
          </label>

          <textarea
            value={
              form.descricao
            }
            onChange={(e) =>
              atualizarCampo(
                'descricao',
                e.target.value
              )
            }
            rows={3}
            className="w-full px-4 py-3 rounded-md border border-[#8e8980]/40 bg-white text-[#171511] outline-none focus:border-[#746c5c]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Preço"
            name="preco"
            type="number"
            step="0.01"
            min="0"
            value={form.preco}
            onChange={(e) =>
              atualizarCampo(
                'preco',
                e.target.value
              )
            }
            required
          />

          <div>
            <label className="block text-sm font-medium text-[#171511] mb-2">
              Categoria
            </label>

            <select
              value={
                form.categoriaId
              }
              onChange={(e) =>
                atualizarCampo(
                  'categoriaId',
                  e.target.value
                )
              }
              className="w-full px-4 py-3 rounded-md border border-[#8e8980]/40 bg-white text-[#171511] outline-none focus:border-[#746c5c]"
              required
            >
              <option value="">
                Selecione
              </option>

              {categorias.map(
                (cat) => (
                  <option
                    key={cat.id}
                    value={cat.id}
                  >
                    {cat.nome}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#171511] mb-2">
              Tipo de produto
            </label>

            <select
              value={
                form.tipoProdutoId
              }
              onChange={(e) =>
                atualizarCampo(
                  'tipoProdutoId',
                  e.target.value
                )
              }
              className="w-full px-4 py-3 rounded-md border border-[#8e8980]/40 bg-white text-[#171511] outline-none focus:border-[#746c5c]"
              required
            >
              <option value="">
                Selecione
              </option>

              {tiposProduto.map(
                (tipo) => (
                  <option
                    key={tipo.id}
                    value={tipo.id}
                  >
                    {tipo.nome}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {tipoEhCalcado() && (
          <div className="border-t border-[#8e8980]/20 pt-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <h3 className="font-medium text-[#171511]">
                  Tamanhos e estoque
                </h3>

                <p className="text-sm text-[#8e8980] mt-1">
                  Visualize os tamanhos existentes, confira o estoque e adicione novas variações.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  adicionarVariacao
                }
                disabled={
                  carregandoVariacoes
                }
                className="w-full sm:w-auto px-3 py-2 rounded-md bg-[#171511] text-[#e2dacc] text-sm hover:opacity-90 disabled:opacity-50"
              >
                + Adicionar tamanho
              </button>
            </div>

            {carregandoVariacoes ? (
              <div className="border border-[#8e8980]/20 rounded-md px-4 py-6 text-center">
                <p className="text-sm text-[#8e8980]">
                  Carregando variações...
                </p>
              </div>
            ) : form.variacoes.length === 0 ? (
              <div className="border border-dashed border-[#8e8980]/40 rounded-md px-4 py-6 text-center">
                <p className="text-sm text-[#8e8980]">
                  Nenhum tamanho cadastrado.
                </p>

                <p className="text-xs text-[#8e8980] mt-1">
                  Clique em “Adicionar tamanho” para cadastrar uma nova numeração.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {form.variacoes.map(
                  (
                    variacao,
                    index
                  ) => {
                    const existente =
                      Boolean(
                        variacao.id
                      );

                    return (
                      <div
                        key={
                          variacao.id ||
                          `nova-${index}`
                        }
                        className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_100px_auto] gap-3 items-end p-3 rounded-md border border-[#8e8980]/20 bg-[#faf9f7]"
                      >
                        <Input
                          label="Tamanho"
                          name={`tamanho-${index}`}
                          placeholder="Ex.: 37/38"
                          value={
                            variacao.tamanho
                          }
                          onChange={(
                            e
                          ) =>
                            atualizarVariacao(
                              index,
                              'tamanho',
                              e.target.value
                            )
                          }
                          required
                        />

                        <Input
                          label="Cor"
                          name={`cor-${index}`}
                          placeholder="Opcional"
                          value={
                            variacao.cor
                          }
                          onChange={(
                            e
                          ) =>
                            atualizarVariacao(
                              index,
                              'cor',
                              e.target.value
                            )
                          }
                        />

                        <Input
                          label="Estoque"
                          name={`estoque-${index}`}
                          type="number"
                          min="0"
                          value={
                            variacao.estoque
                          }
                          disabled={
                            existente
                          }
                          onChange={(
                            e
                          ) =>
                            atualizarVariacao(
                              index,
                              'estoque',
                              e.target.value
                            )
                          }
                          required
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removerVariacao(
                              index
                            )
                          }
                          className="w-full sm:w-auto h-[46px] px-3 rounded-md border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          Remover
                        </button>

                        {existente && (
                          <p className="sm:col-span-4 text-xs text-[#8e8980]">
                            Estoque atual:{" "}
                            {variacao.estoque}
                            . Para adicionar estoque, use o gerenciamento de variações.
                          </p>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
          <label className="flex items-center gap-2 text-sm text-[#171511]">
            <input
              type="checkbox"
              checked={
                form.destaque
              }
              onChange={(e) =>
                atualizarCampo(
                  'destaque',
                  e.target.checked
                )
              }
            />

            Destaque
          </label>

          <label className="flex items-center gap-2 text-sm text-[#171511]">
            <input
              type="checkbox"
              checked={
                form.promocao
              }
              onChange={(e) =>
                atualizarCampo(
                  'promocao',
                  e.target.checked
                )
              }
            />

            Promoção
          </label>
        </div>

        <Button
          type="submit"
          disabled={
            salvando ||
            carregandoVariacoes
          }
        >
          {salvando
            ? 'Salvando...'
            : 'Salvar produto'}
        </Button>
      </form>
    </Modal>
  );
}

export default ModalProduto;