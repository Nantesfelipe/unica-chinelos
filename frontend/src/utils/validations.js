export function validarEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email);
}

export function validarSenha(senha) {
  if (!senha || typeof senha !== 'string') {
    return false;
  }

  return senha.length >= 6;
}

export function validarCampoObrigatorio(valor) {
  if (valor === null || valor === undefined) {
    return false;
  }

  return String(valor).trim().length > 0;
}

export function validarTelefone(telefone) {
  if (!telefone || typeof telefone !== 'string') {
    return false;
  }

  const apenasNumeros = telefone.replace(/\D/g, '');

  return apenasNumeros.length >= 10 &&
         apenasNumeros.length <= 11;
}