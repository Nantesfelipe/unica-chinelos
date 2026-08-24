import { api } from './api';

export function calcularFrete(cep, quantidadeItens, valorPedido) {
  return api('/shipping/calcular', {
    method: 'POST',
    body: JSON.stringify({ cep, quantidadeItens, valorPedido }),
  });
}