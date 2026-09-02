import { api } from './api';

export function listarClientes({
  pagina = 1,
  porPagina = 20,
  busca = '',
} = {}) {
  const params = new URLSearchParams({
    pagina,
    porPagina,
  });

  if (busca) params.set('busca', busca);

  return api(`/users/clientes?${params.toString()}`);
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