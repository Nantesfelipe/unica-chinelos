import { api } from './api';

export function finalizarPedido(dados) {
  return api('/orders', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function processarPagamento(pedidoId, dadosPagamento) {
  return api(`/orders/${pedidoId}/pagamento`, {
    method: 'POST',
    body: JSON.stringify(dadosPagamento),
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

export function listarTodosPedidos({
  pagina = 1,
  porPagina = 20,
  busca = '',
  status = '',
} = {}) {
  const params = new URLSearchParams({
    pagina,
    porPagina,
  });

  if (busca) params.set('busca', busca);
  if (status && status !== 'todos') params.set('status', status);

  return api(`/orders/admin?${params.toString()}`);
}

export function cancelarPedido(id) {
  return api(`/orders/${id}/cancel`, {
    method: 'PATCH',
  });
}