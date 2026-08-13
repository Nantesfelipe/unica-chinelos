import { api } from './api';

export function listarClientes() {
  return api('/users/clientes');
}

export function buscarCliente(id) {
  return api(`/users/clientes/${id}`);
}