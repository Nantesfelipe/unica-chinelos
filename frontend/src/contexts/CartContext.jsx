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
      produto?.imagens?.[0]?.url;

    setCarrinho((carrinhoAtual) => {
      const itemExistente = carrinhoAtual.find(
        (item) => item.id === variacao.id
      );

      if (itemExistente) {
        return carrinhoAtual.map((item) =>
          item.id === variacao.id
            ? { ...item, quantidade: item.quantidade + 1 }
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
          quantidade: 1,
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
      carrinhoAtual.map((item) =>
        item.id === id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      )
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