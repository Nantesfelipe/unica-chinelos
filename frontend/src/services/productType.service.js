import { api } from './api';

export function listarTiposProduto() {
  return api('/product-types');
}