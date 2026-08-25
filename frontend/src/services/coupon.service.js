import { api } from './api';

export function listarCupons() {
  return api('/coupons');
}

export function criarCupom(dados) {
  return api('/coupons', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function atualizarCupom(id, dados) {
  return api(`/coupons/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dados),
  });
}

export function excluirCupom(id) {
  return api(`/coupons/${id}`, {
    method: 'DELETE',
  });
}

export function validarCupom(codigo, valorPedido) {
  return api('/coupons/validar', {
    method: 'POST',
    body: JSON.stringify({ codigo, valorPedido }),
  });
}