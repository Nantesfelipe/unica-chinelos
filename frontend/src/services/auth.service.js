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

export function solicitarRecuperacaoSenha(
  email
) {
  return api('/auth/recuperar-senha', {
    method: 'POST',
    body: JSON.stringify({
      email,
    }),
  });
}

export function redefinirSenha(
  token,
  senha
) {
  return api('/auth/redefinir-senha', {
    method: 'POST',
    body: JSON.stringify({
      token,
      senha,
    }),
  });
}