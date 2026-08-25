import { api } from './api';

export function listarAvaliacoes(produtoId) {
  return api(`/products/${produtoId}/reviews`);
}

export function criarAvaliacao(produtoId, dados) {
  return api(`/products/${produtoId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function excluirAvaliacao(produtoId, avaliacaoId) {
  return api(`/products/${produtoId}/reviews/${avaliacaoId}`, {
    method: 'DELETE',
  });
}