
const pool = require('../config/database');
const { calcularDesconto } = require('../utils/cupomUtils');
const { calcularFrete } = require('../services/freteService');

async function buscarVariacaoComPreco(variacaoId) {
  const result = await pool.query(
    `SELECT
       v.id,
       v.estoque,
       p.preco
     FROM variacao v
     JOIN produto p
       ON p.id = v.produto_id
     WHERE v.id = $1`,
    [variacaoId]
  );

  return result.rows[0];
}

async function criarPedidoComItens({
  usuarioId,
  itens,
  cupomId,
  modalidadeFrete,
}) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const usuarioResult = await client.query(
      `SELECT
         cep,
         logradouro,
         numero,
         complemento,
         bairro,
         cidade,
         estado
       FROM usuario
       WHERE id = $1
       FOR SHARE`,
      [usuarioId]
    );

    const usuario = usuarioResult.rows[0];

    if (!usuario) {
      const erro = new Error('Usuário não encontrado.');
      erro.code = 'USER_NOT_FOUND';
      throw erro;
    }

    const camposEndereco = [
      'cep',
      'logradouro',
      'numero',
      'bairro',
      'cidade',
      'estado',
    ];

    const enderecoCompleto = camposEndereco.every(
      (campo) => {
        const valor = usuario[campo];

        return (
          valor !== null &&
          valor !== undefined &&
          String(valor).trim() !== ''
        );
      }
    );

    if (!enderecoCompleto) {
      const erro = new Error(
        'Complete seu endereço no perfil antes de finalizar o pedido.'
      );

      erro.code = 'INCOMPLETE_ADDRESS';

      throw erro;
    }

    const itensAgrupados = new Map();

    for (const item of itens) {
      const variacaoId = Number(item.variacaoId);
      const quantidade = Number(item.quantidade);

      const quantidadeAtual =
        itensAgrupados.get(variacaoId) || 0;

      itensAgrupados.set(
        variacaoId,
        quantidadeAtual + quantidade
      );
    }

    const itensComPreco = [];

    let valorTotal = 0;

    for (const [
      variacaoId,
      quantidade,
    ] of itensAgrupados) {
      const variacaoResult = await client.query(
        `SELECT
           v.id,
           v.estoque,
           p.preco
         FROM variacao v
         JOIN produto p
           ON p.id = v.produto_id
         WHERE v.id = $1
         FOR UPDATE OF v`,
        [variacaoId]
      );

      const variacao = variacaoResult.rows[0];

      if (!variacao) {
        const erro = new Error(
          `Variação ${variacaoId} não encontrada.`
        );

        erro.code = 'VARIATION_NOT_FOUND';

        throw erro;
      }

      if (
        Number(variacao.estoque) < quantidade
      ) {
        const erro = new Error(
          `Estoque insuficiente para a variação ${variacaoId}.`
        );

        erro.code = 'INSUFFICIENT_STOCK';

        throw erro;
      }

      const preco = Number(variacao.preco);

      itensComPreco.push({
        variacaoId,
        quantidade,
        preco,
      });

      valorTotal += preco * quantidade;
    }

    let valorDesconto = 0;
    let cupomIdValido = null;

    if (cupomId) {
      const cupomResult = await client.query(
        `SELECT *
         FROM cupom
         WHERE id = $1
         FOR SHARE`,
        [cupomId]
      );

      const cupom = cupomResult.rows[0];

      if (!cupom || !cupom.ativo) {
        const erro = new Error(
          'Cupom inválido ou inativo.'
        );

        erro.code = 'INVALID_COUPON';

        throw erro;
      }

      if (
        cupom.validade &&
        new Date(`${cupom.validade}T23:59:59`) <
          new Date()
      ) {
        const erro = new Error(
          'Este cupom expirou.'
        );

        erro.code = 'COUPON_EXPIRED';

        throw erro;
      }

      valorDesconto = calcularDesconto(
        cupom,
        valorTotal
      );

      cupomIdValido = cupom.id;
    }

    let valorFrete = 0;

    if (modalidadeFrete) {
      const resultadoFrete =
        await calcularFrete(
          usuario.cep,
          itens.length,
          valorTotal
        );

      const opcaoEscolhida =
        resultadoFrete.opcoes.find(
          (opcao) =>
            opcao.modalidade === modalidadeFrete
        );

      if (!opcaoEscolhida) {
        const erro = new Error(
          'Opção de frete inválida.'
        );

        erro.code = 'INVALID_SHIPPING';

        throw erro;
      }

      valorFrete =
        opcaoEscolhida.valorFrete;
    }

    const valorFinal = Math.max(
      valorTotal -
        valorDesconto +
        valorFrete,
      0
    );

    const pedidoResult = await client.query(
      `INSERT INTO pedido (
        usuario_id,
        forma_pagamento,
        valor_total,
        cupom_id,
        valor_desconto,
        valor_frete,
        valor_final,
        status_pagamento,
        cep_entrega,
        logradouro_entrega,
        numero_entrega,
        complemento_entrega,
        bairro_entrega,
        cidade_entrega,
        estado_entrega
      )
      VALUES (
        $1,
        'pendente',
        $2,
        $3,
        $4,
        $5,
        $6,
        'pendente',
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13
      )
      RETURNING *`,
      [
        usuarioId,
        valorTotal,
        cupomIdValido,
        valorDesconto,
        valorFrete,
        valorFinal,
        usuario.cep,
        usuario.logradouro,
        usuario.numero,
        usuario.complemento,
        usuario.bairro,
        usuario.cidade,
        usuario.estado,
      ]
    );

    const pedido = pedidoResult.rows[0];

    for (const item of itensComPreco) {
      await client.query(
        `INSERT INTO item_pedido (
          pedido_id,
          variacao_id,
          quantidade,
          preco_unitario
        )
        VALUES ($1, $2, $3, $4)`,
        [
          pedido.id,
          item.variacaoId,
          item.quantidade,
          item.preco,
        ]
      );

      const estoqueResult =
        await client.query(
          `UPDATE variacao
           SET estoque = estoque - $1
           WHERE id = $2
             AND estoque >= $1
           RETURNING id`,
          [
            item.quantidade,
            item.variacaoId,
          ]
        );

      if (estoqueResult.rowCount === 0) {
        const erro = new Error(
          `Estoque insuficiente para a variação ${item.variacaoId}.`
        );

        erro.code = 'INSUFFICIENT_STOCK';

        throw erro;
      }
    }

    await client.query('COMMIT');

    return pedido;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function devolverEstoquePedido(pedidoId) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const pedidoResult = await client.query(
      `SELECT
         id,
         status
       FROM pedido
       WHERE id = $1
       FOR UPDATE`,
      [pedidoId]
    );

    const pedido = pedidoResult.rows[0];

    if (!pedido) {
      const erro = new Error(
        'Pedido não encontrado.'
      );

      erro.code = 'ORDER_NOT_FOUND';

      throw erro;
    }

    const itensResult = await client.query(
      `SELECT
         variacao_id,
         quantidade
       FROM item_pedido
       WHERE pedido_id = $1`,
      [pedidoId]
    );

    for (const item of itensResult.rows) {
      await client.query(
        `UPDATE variacao
         SET estoque = estoque + $1
         WHERE id = $2`,
        [
          item.quantidade,
          item.variacao_id,
        ]
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function atualizarStatusPedido(
  id,
  status
) {
  const result = await pool.query(
    `UPDATE pedido
     SET status = $1
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );

  return result.rows[0];
}

/*
 * Mapeia o payment_type_id do Mercado Pago
 * para os valores aceitos pela coluna
 * forma_pagamento.
 */
function mapearFormaPagamento(
  paymentTypeId
) {
  const mapa = {
    bank_transfer: 'pix',
    ticket: 'boleto',
    credit_card: 'cartao',
    debit_card: 'cartao',
    prepaid_card: 'cartao',
    digital_wallet: 'cartao',
    account_money: 'cartao',
  };

  return (
    mapa[paymentTypeId] ||
    'pendente'
  );
}

/*
 * Atualiza o status do pagamento e a forma
 * de pagamento utilizada.
 */
async function atualizarStatusEFormaPagamento(
  pedidoId,
  statusPagamento,
  paymentTypeId
) {
  const formaPagamento =
    mapearFormaPagamento(
      paymentTypeId
    );

  const result = await pool.query(
    `UPDATE pedido
     SET
       status_pagamento = $1,
       forma_pagamento = $2
     WHERE id = $3
     RETURNING *`,
    [
      statusPagamento,
      formaPagamento,
      pedidoId,
    ]
  );

  return result.rows[0];
}

async function listarPedidosPorUsuario(
  usuarioId
) {
  const result = await pool.query(
    `SELECT *
     FROM pedido
     WHERE usuario_id = $1
     ORDER BY created_at DESC`,
    [usuarioId]
  );

  return result.rows;
}

async function listarTodosPedidos({
  pagina = 1,
  porPagina = 20,
  busca = '',
  status = '',
} = {}) {
  const offset = (Number(pagina) - 1) * Number(porPagina);

  const condicoes = [];
  const parametros = [];

  if (busca) {
    parametros.push(`%${busca}%`);
    condicoes.push(
      `(u.nome ILIKE $${parametros.length} OR u.email ILIKE $${parametros.length} OR p.id::text = ${JSON.stringify(busca).replace(/"/g, "'")})`
    );
  }

  if (status && status !== 'todos') {
    parametros.push(status);
    condicoes.push(`p.status = $${parametros.length}`);
  }

  const whereClause =
    condicoes.length > 0
      ? `WHERE ${condicoes.join(' AND ')}`
      : '';

  const totalResult = await pool.query(
    `SELECT COUNT(*)::integer AS total
     FROM pedido p
     JOIN usuario u
       ON u.id = p.usuario_id
     ${whereClause}`,
    parametros
  );

  const total = totalResult.rows[0].total;

  parametros.push(Number(porPagina));
  parametros.push(offset);

  const result = await pool.query(
    `SELECT
       p.*,
       u.nome AS usuario_nome,
       u.email AS usuario_email
     FROM pedido p
     JOIN usuario u
       ON u.id = p.usuario_id
     ${whereClause}
     ORDER BY p.created_at DESC
     LIMIT $${parametros.length - 1}
     OFFSET $${parametros.length}`,
    parametros
  );

  return {
    dados: result.rows,
    total,
    pagina: Number(pagina),
    porPagina: Number(porPagina),
    totalPaginas: Math.max(1, Math.ceil(total / Number(porPagina))),
  };
}

async function buscarPedidoComItens(id) {
  const pedidoResult = await pool.query(
    `SELECT
       p.*,

       COALESCE(
         json_agg(
           json_build_object(
             'id', ip.id,
             'variacao_id', ip.variacao_id,
             'quantidade', ip.quantidade,
             'preco_unitario', ip.preco_unitario,
             'produto', pr.nome,
             'cor', v.cor,
             'tamanho', v.tamanho,
             'imagem_url',
               (
                 SELECT pi.url
                 FROM produto_imagem pi
                 WHERE pi.produto_id = pr.id
                 ORDER BY pi.ordem
                 LIMIT 1
               )
           )
           ORDER BY ip.id
         )
         FILTER (
           WHERE ip.id IS NOT NULL
         ),
         '[]'
       ) AS itens

     FROM pedido p

     LEFT JOIN item_pedido ip
       ON ip.pedido_id = p.id

     LEFT JOIN variacao v
       ON v.id = ip.variacao_id

     LEFT JOIN produto pr
       ON pr.id = v.produto_id

     WHERE p.id = $1

     GROUP BY p.id`,
    [id]
  );

  return pedidoResult.rows[0];
}

async function atualizarMercadoPagoId(
  pedidoId,
  mercadoPagoId
) {
  const result = await pool.query(
    `UPDATE pedido
     SET mercado_pago_id = $1
     WHERE id = $2
     RETURNING *`,
    [
      mercadoPagoId,
      pedidoId,
    ]
  );

  return result.rows[0];
}

const STATUS_CANCELAVEIS = [
  'recebido',
];

async function cancelarPedido(
  pedidoId,
  usuarioId
) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const pedidoResult =
      await client.query(
        `SELECT
           id,
           usuario_id,
           status
         FROM pedido
         WHERE id = $1
         FOR UPDATE`,
        [pedidoId]
      );

    const pedido =
      pedidoResult.rows[0];

    if (!pedido) {
      const erro = new Error(
        'Pedido não encontrado.'
      );

      erro.code =
        'ORDER_NOT_FOUND';

      throw erro;
    }

    if (
      pedido.usuario_id !==
      usuarioId
    ) {
      const erro = new Error(
        'Acesso negado a este pedido.'
      );

      erro.code =
        'ORDER_FORBIDDEN';

      throw erro;
    }

    if (
      !STATUS_CANCELAVEIS.includes(
        pedido.status
      )
    ) {
      const erro = new Error(
        'Este pedido não pode mais ser cancelado.'
      );

      erro.code =
        'ORDER_CANNOT_CANCEL';

      throw erro;
    }

    const itensResult =
      await client.query(
        `SELECT
           variacao_id,
           quantidade
         FROM item_pedido
         WHERE pedido_id = $1`,
        [pedidoId]
      );

    for (
      const item of itensResult.rows
    ) {
      await client.query(
        `UPDATE variacao
         SET estoque = estoque + $1
         WHERE id = $2`,
        [
          item.quantidade,
          item.variacao_id,
        ]
      );
    }

    const pedidoAtualizadoResult =
      await client.query(
        `UPDATE pedido
         SET status = 'cancelado'
         WHERE id = $1
         RETURNING *`,
        [pedidoId]
      );

    await client.query('COMMIT');

    return pedidoAtualizadoResult
      .rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  buscarVariacaoComPreco,
  criarPedidoComItens,
  devolverEstoquePedido,
  atualizarStatusPedido,
  atualizarStatusEFormaPagamento,
  listarPedidosPorUsuario,
  listarTodosPedidos,
  atualizarMercadoPagoId,
  buscarPedidoComItens,
  cancelarPedido,
};

