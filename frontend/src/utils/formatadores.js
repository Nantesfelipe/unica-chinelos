export function somenteNumeros(valor = '') {
  return String(valor).replace(/\D/g, '');
}

export function normalizarTexto(valor = '') {
  return String(valor)
    .trim()
    .replace(/\s+/g, ' ');
}

export function formatarCpf(valor = '') {
  const numeros = somenteNumeros(valor).slice(0, 11);

  if (numeros.length <= 3) {
    return numeros;
  }

  if (numeros.length <= 6) {
    return numeros.replace(
      /^(\d{3})(\d+)/,
      '$1.$2'
    );
  }

  if (numeros.length <= 9) {
    return numeros.replace(
      /^(\d{3})(\d{3})(\d+)/,
      '$1.$2.$3'
    );
  }

  return numeros.replace(
    /^(\d{3})(\d{3})(\d{3})(\d{1,2})/,
    '$1.$2.$3-$4'
  );
}

export function normalizarCpf(valor = '') {
  const numeros = somenteNumeros(valor);

  return numeros || null;
}

export function removerCodigoPaisBrasil(
  valor = ''
) {
  let numeros = somenteNumeros(valor);

  if (
    (numeros.length === 12 ||
      numeros.length === 13) &&
    numeros.startsWith('55')
  ) {
    numeros = numeros.slice(2);
  }

  return numeros;
}

export function formatarTelefone(valor = '') {
  const numeros =
    removerCodigoPaisBrasil(valor).slice(0, 11);

  if (numeros.length <= 2) {
    return numeros;
  }

  if (numeros.length <= 6) {
    return numeros.replace(
      /^(\d{2})(\d+)/,
      '($1) $2'
    );
  }

  if (numeros.length <= 10) {
    return numeros.replace(
      /^(\d{2})(\d{4})(\d+)/,
      '($1) $2-$3'
    );
  }

  return numeros.replace(
    /^(\d{2})(\d{5})(\d{1,4})/,
    '($1) $2-$3'
  );
}

export function normalizarTelefone(
  valor = ''
) {
  const numeros =
    removerCodigoPaisBrasil(valor);

  return numeros || null;
}

export function formatarCep(valor = '') {
  const numeros = somenteNumeros(valor).slice(0, 8);

  if (numeros.length <= 5) {
    return numeros;
  }

  return numeros.replace(
    /^(\d{5})(\d{1,3})/,
    '$1-$2'
  );
}

export function normalizarCep(valor = '') {
  const numeros = somenteNumeros(valor);

  return numeros || null;
}

const ESTADOS_BRASIL = {
  AC: 'AC',
  ACRE: 'AC',

  AL: 'AL',
  ALAGOAS: 'AL',

  AP: 'AP',
  AMAPA: 'AP',
  AMAPÁ: 'AP',

  AM: 'AM',
  AMAZONAS: 'AM',

  BA: 'BA',
  BAHIA: 'BA',

  CE: 'CE',
  CEARA: 'CE',
  CEARÁ: 'CE',

  DF: 'DF',
  'DISTRITO FEDERAL': 'DF',

  ES: 'ES',
  'ESPIRITO SANTO': 'ES',
  'ESPÍRITO SANTO': 'ES',

  GO: 'GO',
  GOIAS: 'GO',
  GOIÁS: 'GO',

  MA: 'MA',
  MARANHAO: 'MA',
  MARANHÃO: 'MA',

  MT: 'MT',
  'MATO GROSSO': 'MT',

  MS: 'MS',
  'MATO GROSSO DO SUL': 'MS',

  MG: 'MG',
  'MINAS GERAIS': 'MG',

  PA: 'PA',
  PARA: 'PA',
  PARÁ: 'PA',

  PB: 'PB',
  PARAIBA: 'PB',
  PARAÍBA: 'PB',

  PR: 'PR',
  PARANA: 'PR',
  PARANÁ: 'PR',

  PE: 'PE',
  PERNAMBUCO: 'PE',

  PI: 'PI',
  PIAUI: 'PI',
  PIAUÍ: 'PI',

  RJ: 'RJ',
  RIODEJANEIRO: 'RJ',
  'RIO DE JANEIRO': 'RJ',

  RN: 'RN',
  'RIO GRANDE DO NORTE': 'RN',

  RS: 'RS',
  'RIO GRANDE DO SUL': 'RS',

  RO: 'RO',
  RONDONIA: 'RO',
  RONDÔNIA: 'RO',

  RR: 'RR',
  RORAIMA: 'RR',

  SC: 'SC',
  'SANTA CATARINA': 'SC',

  SP: 'SP',
  'SAO PAULO': 'SP',
  'SÃO PAULO': 'SP',

  SE: 'SE',
  SERGIPE: 'SE',

  TO: 'TO',
  TOCANTINS: 'TO',
};

export function normalizarEstado(valor = '') {
  const texto = normalizarTexto(valor)
    .replace(/\./g, ' ')
    .toUpperCase();

  const chave = texto.replace(/\s+/g, ' ');

  return (
    ESTADOS_BRASIL[chave] ||
    ESTADOS_BRASIL[chave.replace(/\s/g, '')] ||
    chave.slice(0, 2)
  );
}