const BASE_URL = import.meta.env.VITE_API_URL;

async function api(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const erro = await response.json().catch(() => ({ erro: 'Erro desconhecido' }));
    throw new Error(erro.erro || 'Erro na requisição');
  }

  return response.json();
}

export default api;