import { api } from './api';

export function finalizarPedido(dados) {
  return api('/orders', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function listarPedidos() {
  return api('/orders');
}

export function buscarPedidoPorId(id) {
  return api(`/orders/${id}`);
}

export function atualizarStatusPedido(id, dados) {
  return api(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(dados),
  });
}

export function listarTodosPedidos() {
  return api('/orders/admin');
}