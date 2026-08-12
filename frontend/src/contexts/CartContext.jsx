import { createContext, useEffect, useState } from 'react';

export const CartContext = createContext();

function CartProvider({ children }) {
  const [carrinho, setCarrinho] = useState(() => {
    const carrinhoSalvo = localStorage.getItem('carrinho');

    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
  });

  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }, [carrinho]);

  function adicionarAoCarrinho(produto, variacao) {
    if (!variacao) {
      throw new Error('Selecione uma variação antes de adicionar ao carrinho.');
    }

    const imagem =
  produto?.imagem ||
  produto?.imagem_url ||
  produto?.imagemUrl ||
  produto?.imagens?.[0]?.url;

    setCarrinho((carrinhoAtual) => {
      const itemExistente = carrinhoAtual.find(
        (item) => item.id === variacao.id
      );

      if (itemExistente) {
        if (
          Number.isFinite(Number(variacao.estoque)) &&
          itemExistente.quantidade >= Number(variacao.estoque)
        ) {
          return carrinhoAtual;
        }

        return carrinhoAtual.map((item) =>
          item.id === variacao.id
            ? {
              ...item,
              quantidade: item.quantidade + 1,
              estoque: variacao.estoque,
            }
            : item
        );
      }

      return [
  ...carrinhoAtual,
  {
    id: variacao.id,
    produtoId: produto.id,
    variacaoId: variacao.id,
    nome: produto.nome,
    preco: produto.preco,
    cor: variacao.cor,
    tamanho: variacao.tamanho,
    imagem,
    imagens: produto?.imagens || [],
    quantidade: 1,
    estoque: Number(variacao.estoque),
  },
];
    });
  }

  function removerDoCarrinho(id) {
    setCarrinho((carrinhoAtual) =>
      carrinhoAtual.filter((item) => item.id !== id)
    );
  }

  function aumentarQuantidade(id) {
    setCarrinho((carrinhoAtual) =>
      carrinhoAtual.map((item) => {
        if (item.id !== id) {
          return item;
        }

        if (
          Number.isFinite(Number(item.estoque)) &&
          item.quantidade >= Number(item.estoque)
        ) {
          return item;
        }

        return {
          ...item,
          quantidade: item.quantidade + 1,
        };
      })
    );
  }

  function diminuirQuantidade(id) {
    setCarrinho((carrinhoAtual) =>
      carrinhoAtual
        .map((item) =>
          item.id === id
            ? { ...item, quantidade: item.quantidade - 1 }
            : item
        )
        .filter((item) => item.quantidade > 0)
    );
  }

  function limparCarrinho() {
    setCarrinho([]);
  }

  const quantidadeItens = carrinho.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  const totalCarrinho = carrinho.reduce(
    (total, item) => total + Number(item.preco) * item.quantidade,
    0
  );

  return (
    <CartContext.Provider
      value={{
        carrinho,
        adicionarAoCarrinho,
        removerDoCarrinho,
        aumentarQuantidade,
        diminuirQuantidade,
        limparCarrinho,
        quantidadeItens,
        totalCarrinho,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;