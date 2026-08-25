function calcularDesconto(cupom, valorPedido) {
  const valor = Number(cupom.valor);
  const pedido = Number(valorPedido);

  if (!Number.isFinite(valor) || !Number.isFinite(pedido) || pedido <= 0) {
    return 0;
  }

  if (cupom.tipo_desconto === 'percentual') {
    return pedido * (valor / 100);
  }

  return Math.min(valor, pedido);
}

module.exports = { calcularDesconto };