// URL base da API
export const API_URL = 'http://localhost:3000';

// Chaves utilizadas no localStorage
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'usuario',
  CART: 'carrinho',
};

// Tipos de usuário
export const USER_TYPES = {
  CLIENTE: 'cliente',
  ADMIN: 'admin',
};

// Status possíveis de um pedido
export const ORDER_STATUS = {
  RECEBIDO: 'recebido',
  EM_SEPARACAO: 'em_separacao',
  ENVIADO: 'enviado',
  ENTREGUE: 'entregue',
  CANCELADO: 'cancelado',
};

export const ORDER_STATUS_LABELS = {
  recebido: 'Recebido',
  em_separacao: 'Em separação',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};