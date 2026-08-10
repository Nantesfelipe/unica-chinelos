import { api } from './api';

// Produtos

export function listarProdutos() {
  return api('/products');
}

export function buscarProdutoPorId(id) {
  return api(`/products/${id}`);
}

export function criarProduto(dados) {
  return api('/products', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function atualizarProduto(id, dados) {
  return api(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados),
  });
}

export function excluirProduto(id) {
  return api(`/products/${id}`, {
    method: 'DELETE',
  });
}


// Variações

export function listarVariacoes(produtoId) {
  return api(`/products/${produtoId}/variations`);
}

export function criarVariacao(produtoId, dados) {
  return api(`/products/${produtoId}/variations`, {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}


// Imagens

export function listarImagens(produtoId) {
  return api(`/products/${produtoId}/images`);
}

export function enviarImagens(produtoId, imagens) {
  const formData = new FormData();

  imagens.forEach((imagem) => {
    formData.append('imagens', imagem);
  });

  return api(`/products/${produtoId}/images`, {
    method: 'POST',
    body: formData,
  });
}