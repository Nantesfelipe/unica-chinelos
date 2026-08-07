import api from './api';

export function listarProdutos(filtros = {}) {
  const params = new URLSearchParams(filtros).toString();
  const query = params ? `?${params}` : '';
  return api(`/products${query}`);
}

export function buscarProdutoPorId(id) {
  return api(`/products/${id}`);
}

export function listarCategorias() {
  return api('/categories');
}

export function listarVariacoes(produtoId) {
  return api(`/products/${produtoId}/variations`);
}

export function listarImagens(produtoId) {
  return api(`/products/${produtoId}/images`);
}