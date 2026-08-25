const ORIGEM = {
  cidade: 'Campo Grande',
  estado: 'MS',
};

/*
 * Zonas de entrega calculadas a partir da
 * distância logística de Campo Grande - MS.
 * Agrupamento por proximidade real, não por
 * região político-administrativa.
 */
const ZONA_POR_UF = {
  // Zona 1 - local (própria base)
  MS: 'local',

  // Zona 2 - vizinhos / eixo Centro-Oeste-Sudeste
  MT: 'vizinha',
  SP: 'vizinha',
  GO: 'vizinha',
  DF: 'vizinha',
  PR: 'vizinha',

  // Zona 3 - Sul / Sudeste mais distante
  MG: 'sul_sudeste',
  RJ: 'sul_sudeste',
  ES: 'sul_sudeste',
  SC: 'sul_sudeste',
  RS: 'sul_sudeste',

  // Zona 4 - Nordeste
  BA: 'nordeste',
  SE: 'nordeste',
  AL: 'nordeste',
  PE: 'nordeste',
  PB: 'nordeste',
  RN: 'nordeste',
  CE: 'nordeste',
  PI: 'nordeste',
  MA: 'nordeste',

  // Zona 5 - Norte
  AC: 'norte',
  RO: 'norte',
  AM: 'norte',
  RR: 'norte',
  PA: 'norte',
  AP: 'norte',
  TO: 'norte',
};

/*
 * Preços e prazos por zona, baseados em médias
 * praticadas por Correios (PAC/SEDEX) e
 * transportadoras para encomendas leves
 * (perfil calçados, até ~0,6kg).
 */
const CONFIG_ZONA = {
  local: {
    economico: { valorBase: 12, prazoDias: 2 },
    expresso: { valorBase: 20, prazoDias: 1 },
  },
  vizinha: {
    economico: { valorBase: 19, prazoDias: 4 },
    expresso: { valorBase: 32, prazoDias: 2 },
  },
  sul_sudeste: {
    economico: { valorBase: 25, prazoDias: 6 },
    expresso: { valorBase: 42, prazoDias: 3 },
  },
  nordeste: {
    economico: { valorBase: 33, prazoDias: 9 },
    expresso: { valorBase: 52, prazoDias: 5 },
  },
  norte: {
    economico: { valorBase: 42, prazoDias: 12 },
    expresso: { valorBase: 65, prazoDias: 7 },
  },
};

const VALOR_ITEM_EXTRA = {
  economico: 4,
  expresso: 6,
};

/*
 * Frete grátis acima de um valor de pedido.
 * Ajuste ou remova conforme a política
 * comercial definida pelo cliente.
 */
const VALOR_MINIMO_FRETE_GRATIS = 300;

async function buscarEnderecoPorCep(cep) {
  const cepLimpo = String(cep).replace(/\D/g, '');

  if (cepLimpo.length !== 8) {
    const erro = new Error('CEP inválido.');
    erro.code = 'CEP_INVALIDO';
    throw erro;
  }

  const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  const dados = await resposta.json();

  if (dados.erro) {
    const erro = new Error('CEP não encontrado.');
    erro.code = 'CEP_NAO_ENCONTRADO';
    throw erro;
  }

  return dados;
}

function calcularValorModalidade(configModalidade, modalidade, quantidadeItens, valorPedido) {
  if (
    VALOR_MINIMO_FRETE_GRATIS &&
    valorPedido !== undefined &&
    valorPedido !== null &&
    Number(valorPedido) >= VALOR_MINIMO_FRETE_GRATIS
  ) {
    return 0;
  }

  const itensExtras = Math.max(0, Number(quantidadeItens) - 1);
  const valor =
    configModalidade.valorBase +
    itensExtras * VALOR_ITEM_EXTRA[modalidade];

  return Number(valor.toFixed(2));
}

async function calcularFrete(cep, quantidadeItens = 1, valorPedido) {
  const endereco = await buscarEnderecoPorCep(cep);
  const zona = ZONA_POR_UF[endereco.uf] || 'norte';
  const configZona = CONFIG_ZONA[zona];

  const opcoes = ['economico', 'expresso'].map((modalidade) => ({
    modalidade,
    nome: modalidade === 'economico' ? 'Econômico' : 'Expresso',
    valorFrete: calcularValorModalidade(
      configZona[modalidade],
      modalidade,
      quantidadeItens,
      valorPedido
    ),
    prazoDias: configZona[modalidade].prazoDias,
  }));

  return {
    origem: ORIGEM,
    destino: {
      cep: endereco.cep,
      cidade: endereco.localidade,
      estado: endereco.uf,
    },
    opcoes,
  };
}

module.exports = { calcularFrete, buscarEnderecoPorCep };