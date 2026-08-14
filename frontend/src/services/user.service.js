import { api } from './api';

export function listarClientes() {
  return api('/users/clientes');
}

export function buscarCliente(id) {
  return api(`/users/clientes/${id}`);
}

export function obterMeuPerfil() {
  return api('/users/me');
}

export function atualizarMeuPerfil(dados) {
  return api('/users/me', {
    method: 'PUT',
    body: JSON.stringify(dados),
  });
}