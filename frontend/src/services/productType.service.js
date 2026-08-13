import { api } from './api';

export function listarTiposProduto() {
  return api('/product-types');
}

export function listarTiposComProdutos() {
  return api('/product-types/com-produtos');
}

export function criarTipoProduto(dados) {
  return api('/product-types', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function atualizarTipoProduto(id, dados) {
  return api(`/product-types/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados),
  });
}

export function excluirTipoProduto(id) {
  return api(`/product-types/${id}`, {
    method: 'DELETE',
  });
}