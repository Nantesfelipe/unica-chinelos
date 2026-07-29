const pool = require('../config/database');

async function buscarVariacaoComPreco(variacaoId) {
  const result = await pool.query(
    `SELECT v.id, v.estoque, p.preco
     FROM variacao v
     JOIN produto p ON p.id = v.produto_id
     WHERE v.id = $1`,
    [variacaoId]
  );
  return result.rows[0];
}

async function criarPedidoComItens({ usuarioId, formaPagamento, itensComPreco, valorTotal }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const pedidoResult = await client.query(
      `INSERT INTO pedido (usuario_id, forma_pagamento, valor_total)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [usuarioId, formaPagamento, valorTotal]
    );
    const pedido = pedidoResult.rows[0];

    for (const item of itensComPreco) {
      await client.query(
        `INSERT INTO item_pedido (pedido_id, variacao_id, quantidade, preco_unitario)
         VALUES ($1, $2, $3, $4)`,
        [pedido.id, item.variacaoId, item.quantidade, item.preco]
      );

      await client.query(
        `UPDATE variacao SET estoque = estoque - $1 WHERE id = $2`,
        [item.quantidade, item.variacaoId]
      );
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


async function atualizarStatusPedido(id, status) {
  const result = await pool.query(
    `UPDATE pedido SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return result.rows[0];
}

async function listarPedidosPorUsuario(usuarioId) {
  const result = await pool.query(
    `SELECT * FROM pedido WHERE usuario_id = $1 ORDER BY created_at DESC`,
    [usuarioId]
  );
  return result.rows;
}

async function buscarPedidoComItens(pedidoId) {
  const pedidoResult = await pool.query('SELECT * FROM pedido WHERE id = $1', [pedidoId]);
  const pedido = pedidoResult.rows[0];
  if (!pedido) return null;

  const itensResult = await pool.query(
    `SELECT ip.*, v.cor, v.tamanho, p.nome
     FROM item_pedido ip
     JOIN variacao v ON v.id = ip.variacao_id
     JOIN produto p ON p.id = v.produto_id
     WHERE ip.pedido_id = $1`,
    [pedidoId]
  );

  return { ...pedido, itens: itensResult.rows };
}

module.exports = {
  buscarVariacaoComPreco,
  criarPedidoComItens,
  atualizarStatusPedido,
  listarPedidosPorUsuario,
  buscarPedidoComItens
};
