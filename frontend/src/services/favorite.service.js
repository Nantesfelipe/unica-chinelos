import { api } from './api';

export function listarFavoritos() {
  return api('/favorites');
}

export function adicionarFavorito(produtoId) {
  return api('/favorites', {
    method: 'POST',
    body: JSON.stringify({ produtoId }),
  });
}

export function removerFavorito(produtoId) {
  return api(`/favorites/${produtoId}`, {
    method: 'DELETE',
  });
}