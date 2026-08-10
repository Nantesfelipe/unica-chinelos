import { api } from './api';

export function listarCategorias() {
  return api('/categories');
}

export function criarCategoria(dados) {
  return api('/categories', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function excluirCategoria(id) {
  return api(`/categories/${id}`, {
    method: 'DELETE',
  });
}