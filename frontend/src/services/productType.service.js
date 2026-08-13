import { api } from './api';

export function listarTiposProduto() {
  return api('/product-types');
}

export function listarTiposComProdutos() {
  return api('/product-types/com-produtos');
}