import { api } from './api';

export function cadastrar(dados) {
  return api('/auth/cadastro', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function login(dados) {
  return api('/auth/login', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export function obterUsuarioAtual() {
  return api('/auth/me');
}